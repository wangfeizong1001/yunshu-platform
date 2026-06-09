# Database and Cache Architecture

## Overview

This system uses **PostgreSQL 16** as the primary database for persistent business data storage, combined with **Redis 7** for caching layer and distributed lock implementation, creating a high-performance data access architecture for read-heavy workloads.

## Architecture Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Application Layer                         │
│  ┌───────────────────────┐    ┌───────────────────────────────┐  │
│  │   Business Services   │    │      Cache Decorators         │  │
│  │  (createProject etc.) │    │ (@cacheable, @cacheEvict etc.)│  │
│  └───────────┬───────────┘    └───────────────┬──────────────┘  │
│              │                                  │                 │
│              ▼                                  ▼                 │
├─────────────────────────────────────────────────────────────────┤
│                         Data Access Layer                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  IRepository<T, TId>                   │    │
│  │  (findById / findAll / create / update / delete)       │    │
│  └────────────────────┬──────────────────────────────────┘    │
│                       │                                         │
│     ┌─────────────────┴───────────────────────────┐           │
│     ▼                                              ▼           │
│  ┌────────────────┐                         ┌─────────────┐    │
│  │  PostgresSQL   │                         │    Redis    │    │
│  │   Database     │                         │     Cache   │    │
│  │  (Port 5432)  │                         │  (Port 6379)│    │
│  └────────────────┘                         └─────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## PostgreSQL Design

### Version and Configuration

- **Version**: PostgreSQL 16 (Alpine)
- **Port**: 5432
- **Database Name**: yunshu
- **Username**: yunshu
- **Connection Pool**: Min 2, Max 20 connections
- **Connection Timeout**: 30 seconds

### Data Access Pattern

The system uses the Repository pattern to abstract the data access layer, providing a unified interface:

```typescript
interface IRepository<T, TId> {
  // Query single entity by ID
  findById(id: TId): Promise<T | null>;

  // Query all entities with optional filtering
  findAll(filter?: Record<string, unknown>): Promise<T[]>;

  // Create a new entity
  create(entity: Omit<T, 'id'>): Promise<T>;

  // Update an entity
  update(id: TId, data: Partial<T>): Promise<T>;

  // Delete an entity
  delete(id: TId): Promise<boolean>;
}
```

### Database Initialization

Database initialization flow:

1. **Container Startup**: Docker Compose starts the PostgreSQL container
2. **Auto Schema Creation**: Executes SQL scripts in `./docker/postgres/init/` directory
3. **Connection Ready**: Confirms service availability via health check `pg_isready -U yunshu -d yunshu`
4. **Application Connect**: Backend service starts after PostgreSQL health status confirmed

### Database Configuration (docker-compose.yml)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: yunshu-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: yunshu
      POSTGRES_USER: yunshu
      POSTGRES_PASSWORD: yunshupassword
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data      # Data persistence
      - ./docker/postgres/init:/docker-entrypoint-initdb.d  # Init scripts
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yunshu -d yunshu"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## Redis Cache Design

### Version and Configuration

- **Version**: Redis 7 (Alpine)
- **Port**: 6379
- **Data Directory**: /data
- **Persistence**: AOF (Append Only File) + RDB

### Cache Architecture Layers

```
              Request
                 │
          ┌──────▼──────┐
          │ Application │
          └──────┬──────┘
                 │
          ┌──────▼──────┐
          │  L1 Cache   │  (In-process memory cache - optional)
          │  (In-Memory)│
          └──────┬──────┘
                 │  miss
          ┌──────▼──────┐
          │  L2 Cache   │  (Redis - distributed shared cache)
          │   (Redis)   │
          └──────┬──────┘
                 │  miss
          ┌──────▼──────┐
          │  PostgreSQL │  (Persistent storage)
          └─────────────┘
```

### Cache Key Design Specification

```typescript
// General format: {prefix}:{entityType}:{id}
const cacheKey = `yunshu:${entityType}:${id}`;

// Examples
const projectKey = 'yunshu:project:12345';
const templateKey = 'yunshu:template:admin:v1';
const queryListKey = 'yunshu:templates:list';
```

### Redis Configuration (docker-compose.yml)

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: yunshu-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Cache Usage Scenarios

1. **Template File Cache**: CLI-generated template file content
2. **Project Configuration Cache**: Frequently accessed project configuration
3. **Session Cache**: User session state (if needed)
4. **Distributed Locks**: Preventing concurrent conflicts

## Cache Decorator Pattern

The project provides declarative cache decorators to simplify cache operations:

### @cacheable - Read Cache

```typescript
// Automatically writes return values to cache, next call reads from cache first
@cacheable({
  key: 'project:config:{name}',  // Supports template variables
  ttl: 3600,                        // 1-hour expiry
  unless: (result) => !result,    // Don't cache null values
})
async getProjectConfig(name: string): Promise<Config> {
  // Business logic...
}
```

### @cachePut - Update Cache

```typescript
// Updates cache after each call without affecting method execution
@cachePut({
  key: 'project:{project.id}',
  ttl: 3600,
})
async updateProject(project: Project): Promise<Project> {
  // Update database...
  return project;
}
```

### @cacheEvict - Clear Cache

```typescript
// Deletes specified cache after invocation to maintain data consistency
@cacheEvict({
  key: 'project:{id}',
  allEntries: false,
})
async deleteProject(id: string): Promise<void> {
  // Delete from database...
}
```

### @cacheEvict + allEntries - Batch Clear

```typescript
// Batch clears all caches matching the pattern
@cacheEvict({
  keyPattern: 'project:*',
  allEntries: true,
  beforeInvocation: false,  // Executes after method call
})
async batchUpdateProjects(projects: Project[]): Promise<void> {
  // Batch update operations...
}
```

## Cache Strategies

### Cache Penetration Protection

**Problem**: High volume requests query non-existent data, each time penetrating to the database

**Solutions**:
```typescript
// Method 1: Null value caching (short TTL)
@cacheable({
  key: 'project:{id}',
  ttl: 3600,
  cacheNull: true,        // Cache null values
  nullTtl: 60,            // 1-minute expiry for nulls
})

// Method 2: Bloom Filter
// Pre-populate all valid IDs into a bloom filter, quickly filtering invalid requests
```

### Cache Avalanche Protection

**Problem**: Large number of cache keys expire simultaneously at the same time

**Solution**:
```typescript
// TTL jitter to prevent simultaneous cache key expiration
@cacheable({
  key: 'project:{id}',
  ttl: 3600,                  // Base 1 hour
  ttlJitter: 300,             // ±5 minute random jitter
})
```

### Cache Breakdown Protection

**Problem**: At the moment a hot key expires, massive concurrent requests flood the database

**Solution**:
```typescript
// Use distributed locks to protect cache rebuild for hot keys
@cacheable({
  key: 'hot:data:{id}',
  ttl: 300,
  useLock: true,              // Enable lock mechanism
  lockTimeout: 10000,         // 10-second lock timeout
})
```

## Distributed Locks

### Redis Lock Implementation

```typescript
// Basic usage
const lock = await acquireLock('resource:123', {
  ttl: 5000,                  // 5-second auto-release
  retries: 3,                 // Retry 3 times
  retryDelay: 100,           // 100ms interval between retries
});

try {
  // Critical section code...
} finally {
  await lock.release();
}

// Decorator usage
@distributedLock({
  key: 'project:create:{name}',
  ttl: 30000,
  retries: 5,
})
async createProject(name: string): Promise<Project> {
  // Atomic operation...
}
```

### Lock Best Practices

1. **Always Set TTL**: Prevent deadlocks
2. **Minimize Critical Section**: Only include necessary operations
3. **Use try-finally**: Ensure locks are released
4. **Avoid Nested Locks**: Prevent deadlocks
5. **Monitor Lock Times**: Identify performance bottlenecks

## Performance Optimization

### PostgreSQL Optimization

1. **Index Optimization**:
   - Primary key auto-indexing
   - Add indexes to high-frequency query fields
   - Composite indexes for multi-condition queries

2. **Query Optimization**:
   - Use `EXPLAIN ANALYZE` to analyze execution plans
   - Avoid `SELECT *`, only query needed fields
   - Reasonable use of `LIMIT` to restrict returns

3. **Connection Pool Management**:
   - Min connections: 2 (warm-up connections)
   - Max connections: 20 (adjust based on actual load)

### Redis Optimization

1. **Memory Management**:
   - Set `maxmemory 256mb` to limit memory
   - Use `allkeys-lru` policy for key eviction
   - Monitor memory usage: `redis-cli INFO memory`

2. **Key Design**:
   - Use namespace `yunshu:` prefix
   - Avoid overly long key names
   - Reasonable TTL settings, timely cleanup expired data

3. **Performance Monitoring**:
   ```bash
   # View key count
   redis-cli DBSIZE

   # View slow queries
   redis-cli SLOWLOG GET 10

   # View memory
   redis-cli INFO memory
   ```

## Health Checks

### PostgreSQL Health Check

```bash
# Docker Compose auto-execution
docker exec yunshu-postgres pg_isready -U yunshu -d yunshu

# Manual check
docker exec yunshu-postgres psql -U yunshu -d yunshu -c "SELECT 1;"
```

### Redis Health Check

```bash
# Docker Compose auto-execution
docker exec yunshu-redis redis-cli ping

# Manual check
docker exec yunshu-redis redis-cli PING
# Returns: PONG
```

## Operations

### Database Backup

```bash
# Create backup
docker exec yunshu-postgres pg_dump -U yunshu yunshu > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i yunshu-postgres psql -U yunshu -d yunshu < backup_20250609.sql
```

### Cache Operations

```bash
# Clear cache (during deployment)
docker exec yunshu-redis redis-cli FLUSHALL

# View hot keys
docker exec yunshu-redis redis-cli --scan --pattern "yunshu:*"

# View key TTL
docker exec yunshu-redis redis-cli TTL yunshu:project:12345
```

### Log Viewing

```bash
# PostgreSQL logs
docker-compose logs -f postgres

# Redis logs
docker-compose logs -f redis

# Backend logs (database-related)
docker-compose logs -f backend | grep -E "DB|SQL|Error"
```

## Troubleshooting

### Database Connection Issues

1. **Check container status**
   ```bash
   docker-compose ps postgres
   # Ensure status is Up (healthy)
   ```

2. **Verify environment variables**
   ```bash
   docker exec yunshu-backend env | grep DB_
   ```

3. **Test connectivity**
   ```bash
   docker exec yunshu-backend ping postgres
   docker exec yunshu-backend nc -zv postgres 5432
   ```

### Low Cache Hit Rate

1. **Check keyspace**
   ```bash
   redis-cli KEYS "yunshu:*"
   ```

2. **View statistics**
   ```bash
   redis-cli INFO stats
   # Focus on keyspace_hits / keyspace_misses
   ```

3. **Optimize cache strategy**
   - Increase TTL for hot data
   - Check for frequent cache eviction operations
   - Confirm cache key generation logic correctness

## Production Recommendations

### 1. Enable Password Authentication

```yaml
# Redis production config
redis:
  command: >
    redis-server
    --requirepass ${REDIS_PASSWORD}
    --maxmemory 256mb
    --maxmemory-policy allkeys-lru

# PostgreSQL already configured with POSTGRES_PASSWORD
```

### 2. Don't Expose Ports Externally

```yaml
services:
  postgres:
    # ports:  # Comment out in production, internal network access only
    #   - "5432:5432"
  redis:
    # ports:  # Comment out in production, internal network access only
    #   - "6379:6379"
```

### 3. Regular Backups

```bash
# Add scheduled task
crontab -e
# Daily 3 AM database backup
0 3 * * * /path/to/backup_script.sh
```

### 4. Monitoring & Alerts

- Database connection count monitoring
- Redis memory usage rate
- Cache hit rate alerts (<80% attention needed)
- Slow query log analysis

## Summary

This architecture achieves a high-performance, high-availability data access solution through layered design:

1. **Persistence Layer (PostgreSQL)**: Provides ACID-guaranteed reliable storage
2. **Cache Layer (Redis)**: Accelerates read operations, reducing database pressure
3. **Abstraction Layer (Repository)**: Unifies data access interface for easy maintenance
4. **Declarative Caching (Decorators)**: Simplifies cache operations, lowers threshold
5. **Distributed Locks (Redis)**: Solves resource contention in concurrent scenarios

Through reasonable caching strategies and monitoring, system performance can be significantly improved while ensuring data consistency.

# Docker Compose Deployment

This project uses Docker Compose for one-click deployment, containing four containers: PostgreSQL, Redis, backend service, and admin frontend.

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│                        Docker Network                      │
│  ┌──────────┐    ┌───────────┐    ┌──────────┐   ┌───────┐  │
│  │  Admin   │───▶│  Backend  │───▶│ PostgreSQL │   │ Redis  │  │
│  │  (Port 80) │    │ (Port 8080) │    │ (Port 5432) │   │(6379) │  │
│  └──────────┘    └───────────┘    └──────────┘   └───────┘  │
└───────────────────────────────────────────────────────────┘
```

## Service Overview

| Service | Image | Port Mapping | Description |
|---------|-------|--------------|-------------|
| `postgres` | `postgres:16-alpine` | `5432:5432` | Relational database for business data |
| `redis` | `redis:7-alpine` | `6379:6379` | Cache and distributed lock |
| `backend` | Local build (`Dockerfile`) | `8080:8080` | Backend API service |
| `admin` | Local build (`apps/admin/Dockerfile`) | `80:80` | Admin frontend |

## Prerequisites

| Tool | Minimum Version | Description |
|------|-----------------|-------------|
| Docker | 20.10+ | Container runtime |
| Docker Compose | 2.0+ | Container orchestration tool |

## Quick Start

### 1. Clone the Project

```bash
git clone <your-repo-url>
cd yunshu
```

### 2. Start All Services

```bash
docker-compose up -d
```

### 3. Check Service Status

```bash
docker-compose ps
```

Expected output should show all 4 services in `Up` state.

### 4. View Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 5. Stop Services

```bash
# Stop containers only
docker-compose stop

# Stop and remove containers (preserve volumes)
docker-compose down

# Stop and remove containers and volumes (use with caution)
docker-compose down -v
```

## Service Configuration Details

### PostgreSQL

```yaml
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
    - postgres-data:/var/lib/postgresql/data
    - ./docker/postgres/init:/docker-entrypoint-initdb.d
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U yunshu -d yunshu"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Key Points**:
- Uses `postgres:16-alpine` lightweight image
- Database name, username, password configured via environment variables
- Data persisted to named volume `postgres-data`
- Automatically executes SQL scripts in `./docker/postgres/init` directory on startup
- Health check runs `pg_isready` every 10 seconds

### Redis

```yaml
redis:
  image: redis:7-alpine
  container_name: yunshu-redis
  restart: unless-stopped
  ports:
    - "6379:6379"
  volumes:
    - redis-data:/data
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Key Points**:
- Uses `redis:7-alpine` lightweight image
- Data persisted to named volume `redis-data`
- Health check verified via `redis-cli ping`

### Backend Service

```yaml
backend:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: yunshu-backend
  restart: unless-stopped
  ports:
    - "8080:8080"
  environment:
    NODE_ENV: production
    DB_HOST: postgres
    DB_PORT: 5432
    DB_NAME: yunshu
    DB_USER: yunshu
    DB_PASSWORD: yunshupassword
    REDIS_HOST: redis
    REDIS_PORT: 6379
  depends_on:
    postgres:
      condition: service_healthy
    redis:
      condition: service_healthy
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

**Key Points**:
- **Dependency Order**: Starts only after PostgreSQL and Redis health checks pass
- **Database Connection**: Uses service names `postgres` and `redis` as hostnames (Docker network internal DNS resolution)
- **Health Check**: Calls `/health` endpoint with 40-second startup buffer

### Admin Frontend

```yaml
admin:
  build:
    context: .
    dockerfile: apps/admin/Dockerfile
  container_name: yunshu-admin
  restart: unless-stopped
  ports:
    - "80:80"
  depends_on:
    backend:
      condition: service_healthy
  networks:
    - yunshu-network
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**Key Points**:
- Starts after backend service health check passes
- Production environment should configure HTTPS reverse proxy

## Networks and Volumes

### Networks

```yaml
networks:
  yunshu-network:
    driver: bridge
```

- All services connect to `yunshu-network` bridge network
- Services can access each other by container name (service name)
- Inter-container communication does not require host port exposure

### Volumes

```yaml
volumes:
  postgres-data:
  redis-data:
```

- Uses Docker Named Volumes instead of Bind Mounts
- Data persists even if containers are deleted
- Easier backup and migration

## Production Optimization Recommendations

### 1. Use Environment Variable Files

Create a `.env` file to manage sensitive information:

```bash
# .env
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-redis-password
DB_PASSWORD=your-secure-password
```

Reference in `docker-compose.yml`:

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

### 2. Restrict Port Exposure

Production environments should not expose database ports directly:

```yaml
services:
  postgres:
    # ports:   # Comment out, internal access only
    #   - "5432:5432"
  redis:
    # ports:   # Comment out, internal access only
    #   - "6379:6379"
```

### 3. Configure Redis Password

```yaml
redis:
  command: >
    redis-server
    --requirepass ${REDIS_PASSWORD}
    --maxmemory 256mb
    --maxmemory-policy allkeys-lru
```

### 4. Use Resource Limits

```yaml
services:
  postgres:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
  redis:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
```

### 5. Logging Configuration

```yaml
x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  postgres:
    logging: *default-logging
  # ...other services follow the same pattern
```

## Common Operations Commands

### Database Operations

```bash
# Enter PostgreSQL interactive mode
docker exec -it yunshu-postgres psql -U yunshu -d yunshu

# Backup database
docker exec yunshu-postgres pg_dump -U yunshu yunshu > backup.sql

# Restore database
docker exec -i yunshu-postgres psql -U yunshu -d yunshu < backup.sql

# View database connections
docker exec yunshu-postgres psql -U yunshu -d yunshu -c "SELECT count(*) FROM pg_stat_activity;"
```

### Redis Operations

```bash
# Enter Redis CLI
docker exec -it yunshu-redis redis-cli

# View key count
docker exec yunshu-redis redis-cli DBSIZE

# Clear cache (use with caution)
docker exec yunshu-redis redis-cli FLUSHALL

# View memory usage
docker exec yunshu-redis redis-cli INFO memory
```

### Container Management

```bash
# Restart single service
docker-compose restart backend

# Rebuild and start
docker-compose up -d --build backend

# View resource usage
docker stats

# Clean up unused images and containers
docker system prune -a
```

## Troubleshooting

### Service Fails to Start

1. **Check container status**
   ```bash
   docker-compose ps
   ```

2. **View detailed logs**
   ```bash
   docker-compose logs --tail=100 backend
   ```

3. **Verify network connectivity**
   ```bash
   # Check if containers are on the correct network
   docker network inspect yunshu-yunshu-network
   ```

### Database Connection Failed

1. **Check PostgreSQL health**
   ```bash
   docker exec yunshu-postgres pg_isready -U yunshu -d yunshu
   ```

2. **Verify environment variables**
   ```bash
   docker exec yunshu-backend env | grep -E "DB_|REDIS_"
   ```

3. **Test inter-container connectivity**
   ```bash
   docker exec yunshu-backend ping postgres
   docker exec yunshu-backend nc -zv postgres 5432
   ```

### Cache Not Working

1. **Check Redis connection**
   ```bash
   docker exec yunshu-redis redis-cli ping
   ```

2. **View cache hit rate**
   ```bash
   docker exec yunshu-redis redis-cli INFO stats
   ```

3. **Check keyspace**
   ```bash
   docker exec yunshu-redis redis-cli KEYS "*"
   ```

## Security Hardening Recommendations

### 1. Change Default Passwords

**Strongly recommended** to change all default passwords before deploying to production.

### 2. Use Docker Secrets (Swarm Mode)

```yaml
secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
  redis_password:
    file: ./secrets/redis_password.txt

services:
  postgres:
    secrets:
      - postgres_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
```

### 3. Configure Firewall

Only expose necessary ports (80, 443), do not expose database and cache ports externally.

### 4. Regularly Update Images

```bash
# Pull latest images and rebuild
docker-compose pull
docker-compose up -d

# Clean up old images
docker image prune
```

### 5. Enable HTTPS

Production environments must use HTTPS. Recommended configuration:
- Nginx reverse proxy + Let's Encrypt certificates
- Or use Traefik for automatic certificate management

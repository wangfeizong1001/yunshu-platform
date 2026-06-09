# 数据库与缓存架构

## 概述

本系统采用 **PostgreSQL 16** 作为主数据库存储持久化业务数据，结合 **Redis 7** 实现缓存层和分布式锁，形成"读多写少"场景下的高性能数据访问架构。

## 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                         Application Layer                         │
│  ┌───────────────────────┐    ┌───────────────────────────────┐  │
│  │   Business Services   │    │      Cache Decorators         │  │
│  │  (createProject等)   │    │ (@cacheable, @cacheEvict等)   │  │
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

## PostgreSQL 设计

### 版本与配置

- **版本**: PostgreSQL 16 (Alpine)
- **端口**: 5432
- **数据库名**: yunshu
- **用户名**: yunshu
- **连接池配置**: 最小2个，最大20个连接
- **连接超时**: 30秒

### 数据访问模式

系统使用 Repository 模式抽象数据访问层，提供统一的接口：

```typescript
interface IRepository<T, TId> {
  // 根据ID查询单个实体
  findById(id: TId): Promise<T | null>;

  // 查询所有实体，支持过滤
  findAll(filter?: Record<string, unknown>): Promise<T[]>;

  // 创建新实体
  create(entity: Omit<T, 'id'>): Promise<T>;

  // 更新实体
  update(id: TId, data: Partial<T>): Promise<T>;

  // 删除实体
  delete(id: TId): Promise<boolean>;
}
```

### 数据库初始化

数据库初始化流程：

1. **容器启动**: Docker Compose 启动 PostgreSQL 容器
2. **自动建表**: 执行 `./docker/postgres/init/` 目录下的 SQL 脚本
3. **连接就绪**: 通过健康检查 `pg_isready -U yunshu -d yunshu` 确认服务可用
4. **应用连接**: 后端服务在 PostgreSQL 健康状态后启动

### 数据库配置 (docker-compose.yml)

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
      - postgres-data:/var/lib/postgresql/data      # 数据持久化
      - ./docker/postgres/init:/docker-entrypoint-initdb.d  # 初始化脚本
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U yunshu -d yunshu"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## Redis 缓存设计

### 版本与配置

- **版本**: Redis 7 (Alpine)
- **端口**: 6379
- **数据目录**: /data
- **持久化**: AOF (Append Only File) + RDB

### 缓存架构层级

```
              Request
                 │
          ┌──────▼──────┐
          │ Application │
          └──────┬──────┘
                 │
          ┌──────▼──────┐
          │  L1 Cache   │  (进程内内存缓存 - 可选)
          │  (In-Memory)│
          └──────┬──────┘
                 │  miss
          ┌──────▼──────┐
          │  L2 Cache   │  (Redis - 分布式共享缓存)
          │   (Redis)   │
          └──────┬──────┘
                 │  miss
          ┌──────▼──────┐
          │  PostgreSQL │  (持久化存储)
          └─────────────┘
```

### 缓存键设计规范

```typescript
// 通用格式: {prefix}:{entityType}:{id}
const cacheKey = `yunshu:${entityType}:${id}`;

// 示例
const projectKey = 'yunshu:project:12345';
const templateKey = 'yunshu:template:admin:v1';
const queryListKey = 'yunshu:templates:list';
```

### Redis 配置 (docker-compose.yml)

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

### 缓存使用场景

1. **模板文件缓存**: CLI 生成的模板文件内容
2. **项目配置缓存**: 常用的项目配置信息
3. **会话缓存**: 用户会话状态 (如需)
4. **分布式锁**: 防止并发冲突

## 缓存装饰器模式

项目提供声明式缓存装饰器，简化缓存操作：

### @cacheable - 读取缓存

```typescript
// 当方法返回值时自动写入缓存，下次调用优先从缓存读取
@cacheable({
  key: 'project:config:{name}',  // 支持模板变量
  ttl: 3600,                        // 1小时过期
  unless: (result) => !result,    // 空值不缓存
})
async getProjectConfig(name: string): Promise<Config> {
  // 业务逻辑...
}
```

### @cachePut - 更新缓存

```typescript
// 每次调用后更新缓存，不影响方法执行
@cachePut({
  key: 'project:{project.id}',
  ttl: 3600,
})
async updateProject(project: Project): Promise<Project> {
  // 更新数据库...
  return project;
}
```

### @cacheEvict - 清除缓存

```typescript
// 调用后删除指定缓存，保持数据一致性
@cacheEvict({
  key: 'project:{id}',
  allEntries: false,
})
async deleteProject(id: string): Promise<void> {
  // 从数据库删除...
}
```

### @cacheEvict + allEntries - 批量清除

```typescript
// 批量清除匹配模式的所有缓存
@cacheEvict({
  keyPattern: 'project:*',
  allEntries: true,
  beforeInvocation: false,  // 方法调用后执行
})
async batchUpdateProjects(projects: Project[]): Promise<void> {
  // 批量更新操作...
}
```

## 缓存策略

### 缓存穿透保护

**问题**: 大量请求查询不存在的数据，每次都穿透到数据库

**解决方案**:
```typescript
// 方法1: 空值缓存（短时）
@cacheable({
  key: 'project:{id}',
  ttl: 3600,
  cacheNull: true,        // 缓存 null 值
  nullTtl: 60,            // 空值1分钟过期
})

// 方法2: 布隆过滤器（Bloom Filter）
// 将所有合法ID预先存入布隆过滤器，快速过滤非法请求
```

### 缓存雪崩保护

**问题**: 大量缓存键在同一时间集中过期

**解决方案**:
```typescript
// TTL 抖动，避免缓存键同时过期
@cacheable({
  key: 'project:{id}',
  ttl: 3600,                  // 基础1小时
  ttlJitter: 300,             // ±5分钟随机抖动
})
```

### 缓存击穿保护

**问题**: 热点键失效瞬间，大量并发请求涌入数据库

**解决方案**:
```typescript
// 使用分布式锁保护热点键的缓存重建
@cacheable({
  key: 'hot:data:{id}',
  ttl: 300,
  useLock: true,              // 启用锁机制
  lockTimeout: 10000,         // 10秒锁超时
})
```

## 分布式锁

### Redis 锁实现

```typescript
// 基本用法
const lock = await acquireLock('resource:123', {
  ttl: 5000,                  // 5秒自动释放
  retries: 3,                 // 重试3次
  retryDelay: 100,           // 每次间隔100ms
});

try {
  // 临界区代码...
} finally {
  await lock.release();
}

// 装饰器用法
@distributedLock({
  key: 'project:create:{name}',
  ttl: 30000,
  retries: 5,
})
async createProject(name: string): Promise<Project> {
  // 原子操作...
}
```

### 锁的最佳实践

1. **总是设置 TTL**: 防止死锁
2. **最小化临界区**: 只包含必要的操作
3. **使用 try-finally**: 确保锁被释放
4. **避免嵌套锁**: 防止死锁
5. **监控锁定时间**: 发现性能瓶颈

## 性能优化

### PostgreSQL 优化

1. **索引优化**:
   - 主键自动索引
   - 高频查询字段添加索引
   - 复合索引用于多条件查询

2. **查询优化**:
   - 使用 `EXPLAIN ANALYZE` 分析执行计划
   - 避免 `SELECT *`，只查需要的字段
   - 合理使用 `LIMIT` 限制返回量

3. **连接池管理**:
   - 最小连接数: 2 (预热连接)
   - 最大连接数: 20 (根据实际负载调整)

### Redis 优化

1. **内存管理**:
   - 设置 `maxmemory 256mb` 限制内存
   - 使用 `allkeys-lru` 策略淘汰键
   - 监控内存使用: `redis-cli INFO memory`

2. **键设计**:
   - 使用命名空间 `yunshu:` 前缀
   - 避免过长的键名
   - 合理设置 TTL，及时清理过期数据

3. **性能监控**:
   ```bash
   # 查看键数量
   redis-cli DBSIZE

   # 查看慢查询
   redis-cli SLOWLOG GET 10

   # 查看内存
   redis-cli INFO memory
   ```

## 健康检查

### PostgreSQL 健康检查

```bash
# Docker Compose 自动执行
docker exec yunshu-postgres pg_isready -U yunshu -d yunshu

# 手动检查
docker exec yunshu-postgres psql -U yunshu -d yunshu -c "SELECT 1;"
```

### Redis 健康检查

```bash
# Docker Compose 自动执行
docker exec yunshu-redis redis-cli ping

# 手动检查
docker exec yunshu-redis redis-cli PING
# 返回: PONG
```

## 运维操作

### 数据库备份

```bash
# 创建备份
docker exec yunshu-postgres pg_dump -U yunshu yunshu > backup_$(date +%Y%m%d).sql

# 恢复备份
docker exec -i yunshu-postgres psql -U yunshu -d yunshu < backup_20250609.sql
```

### 缓存操作

```bash
# 清空缓存（部署时）
docker exec yunshu-redis redis-cli FLUSHALL

# 查看热点键
docker exec yunshu-redis redis-cli --scan --pattern "yunshu:*"

# 查看键的 TTL
docker exec yunshu-redis redis-cli TTL yunshu:project:12345
```

### 日志查看

```bash
# PostgreSQL 日志
docker-compose logs -f postgres

# Redis 日志
docker-compose logs -f redis

# 后端日志（数据库相关）
docker-compose logs -f backend | grep -E "DB|SQL|Error"
```

## 故障排查

### 数据库连接问题

1. **检查容器状态**
   ```bash
   docker-compose ps postgres
   # 确保状态为 Up (healthy)
   ```

2. **验证环境变量**
   ```bash
   docker exec yunshu-backend env | grep DB_
   ```

3. **测试连通性**
   ```bash
   docker exec yunshu-backend ping postgres
   docker exec yunshu-backend nc -zv postgres 5432
   ```

### 缓存命中率低

1. **检查键空间**
   ```bash
   redis-cli KEYS "yunshu:*"
   ```

2. **查看统计信息**
   ```bash
   redis-cli INFO stats
   # 关注 keyspace_hits / keyspace_misses
   ```

3. **优化缓存策略**
   - 增加热门数据的 TTL
   - 检查是否有频繁的缓存清除操作
   - 确认缓存键生成逻辑是否正确

## 生产环境建议

### 1. 启用密码认证

```yaml
# Redis 生产配置
redis:
  command: >
    redis-server
    --requirepass ${REDIS_PASSWORD}
    --maxmemory 256mb
    --maxmemory-policy allkeys-lru

# PostgreSQL 已通过 POSTGRES_PASSWORD 设置密码
```

### 2. 不对外暴露端口

```yaml
services:
  postgres:
    # ports:  # 生产环境注释掉，仅内部网络访问
    #   - "5432:5432"
  redis:
    # ports:  # 生产环境注释掉，仅内部网络访问
    #   - "6379:6379"
```

### 3. 定期备份

```bash
# 添加定时任务
crontab -e
# 每天凌晨3点备份数据库
0 3 * * * /path/to/backup_script.sh
```

### 4. 监控告警

- 数据库连接数监控
- Redis 内存使用率
- 缓存命中率告警 (<80% 需关注)
- 慢查询日志分析

## 总结

本架构通过分层设计实现了高性能、高可用的数据访问方案：

1. **持久化层 (PostgreSQL)**: 提供 ACID 保证的可靠存储
2. **缓存层 (Redis)**: 加速读操作，减轻数据库压力
3. **抽象层 (Repository)**: 统一数据访问接口，易于维护
4. **声明式缓存 (装饰器)**: 简化缓存操作，降低使用门槛
5. **分布式锁 (Redis)**: 解决并发场景下的资源竞争问题

通过合理的缓存策略和监控，可以在保证数据一致性的前提下显著提升系统性能。

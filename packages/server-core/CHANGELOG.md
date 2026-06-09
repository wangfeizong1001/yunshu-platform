# Changelog

所有重要的项目变更都将记录在此文件中。

## [0.2.0] - 2024-06-09

### 🚀 新增功能

#### 数据库层（PostgreSQL）
- **PostgreSQL 连接管理器** (`database/PostgresClient.ts`)
  - 单例模式连接池管理
  - 自动重连（指数退避策略）
  - 健康检查（`healthCheck()`）
  - 事务支持（`withTransaction()`）

- **数据访问层抽象** (`repositories/`)
  - `IRepository<T>` 接口：统一的数据访问契约
  - `PostgresRepository<T>`：PostgreSQL 完整实现
  - `PostgresQueryBuilder<T>`：链式 SQL 查询构建器
  - 支持 CRUD、分页、软删除、批量操作

- **数据迁移工具** (`migrations/`)
  - `MigrationUtils`：表创建、索引、外键迁移
  - `AUDIT_COLUMNS`：通用审计字段模板
  - `createAuditableTable()`：快速创建带审计的表

#### 缓存层（Redis + 二级缓存）
- **Redis 客户端** (`cache/RedisClient.ts`)
  - 单例模式管理
  - 自动重连
  - 健康检查

- **二级缓存装饰器** (`cache/CacheDecorator.ts`)
  - L1（内存）+ L2（Redis）二级架构
  - LRU 淘汰策略
  - 自动回填（L2 → L1）
  - 空值缓存（防止穿透）

- **缓存雪崩防护**
  - TTL 随机抖动（`ttlJitter` 参数，默认 ±10%）
  - 避免大量缓存同时过期

- **缓存穿透防护**
  - 空值缓存（`cacheNull` 参数）
  - 布隆过滤器（`BloomFilter`）

- **缓存击穿防护**
  - 热点 Key 互斥锁（`hotKeyThreshold` 参数）
  - 并发请求合并

- **布隆过滤器** (`cache/BloomFilter.ts`)
  - 内存模式和 Redis 模式
  - 快速判断「一定不存在」
  - 可配置误判率和容量

#### 分布式锁
- **分布式锁** (`cache/DistributedLock.ts`)
  - 互斥锁（`acquireLock`）
  - 可重入锁（`reentrant: true`）
  - Lua 脚本保证原子性
  - 降级机制（Redis 不可用时使用本地锁）

- **带锁执行** (`withLock`, `tryWithLock`)

#### 缓存预热
- **缓存预热管理器** (`cache/CacheWarmup.ts`)
  - 启动时预热
  - 定时刷新
  - 并发控制
  - 错误回调

#### 监控统计
- **完善监控** (`getCacheStats`, `getCacheReport`)
  - 命中率（总、L1、L2）
  - 响应时间（各级平均）
  - 层级占比
  - 格式化输出（JSON/Text）

### 🔧 架构改进

- **移除 MongoDB/Mongoose 依赖**
  - 完全迁移到 PostgreSQL
  - 通过 IRepository 接口保持可扩展性

- **BaseService 重构**
  - 基于 IRepository 接口
  - 支持多种数据库适配器
  - 更好的类型安全

### 📖 文档改进

- 完善模块注释
- 统一导出 API
- 类型定义完整

---

## [0.1.0] - 初始版本

- 基础错误处理（BusinessError）
- 基础装饰器（日志、性能监控）
- 基础 BaseService（依赖 Mongoose）

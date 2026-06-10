# 数据库与缓存架构

本文档描述云枢中台的数据库设计原则、缓存策略与数据访问模式。

---

## 一、数据库架构

### 1.1 数据库选型

| 数据库 | 版本 | 用途 | 特点 |
|--------|------|------|------|
| **PostgreSQL** | 16+ | 主数据库 | 事务、复杂查询、JSON 原生支持 |
| **Redis** | 7.x | 缓存与会话存储 | 高性能、分布式锁、发布订阅 |

### 1.2 核心数据表设计

**用户表 (sys_user)**

| 字段 | 类型 | 描述 |
|------|------|------|
| user_id | bigint | 主键 |
| dept_id | bigint | 部门 ID |
| user_name | varchar(30) | 用户名 |
| nick_name | varchar(30) | 昵称 |
| user_type | varchar(2) | 用户类型 |
| email | varchar(50) | 邮箱 |
| phonenumber | varchar(11) | 手机号 |
| sex | char(1) | 性别 |
| avatar | varchar(100) | 头像 |
| password | varchar(100) | 密码哈希 |
| status | char(1) | 状态（0 正常 1 停用） |
| login_ip | varchar(128) | 最后登录 IP |
| login_date | datetime | 最后登录时间 |
| tenant_id | varchar(20) | 租户 ID |
| remark | varchar(500) | 备注 |

**角色表 (sys_role)**

| 字段 | 类型 | 描述 |
|------|------|------|
| role_id | bigint | 主键 |
| role_name | varchar(30) | 角色名称 |
| role_key | varchar(100) | 角色权限字符串 |
| role_sort | int | 显示顺序 |
| data_scope | char(1) | 数据范围（1 全部 2 自定义 3 本部门 4 本部门及以下 5 仅本人） |
| status | char(1) | 状态 |
| tenant_id | varchar(20) | 租户 ID |

**菜单表 (sys_menu)**

| 字段 | 类型 | 描述 |
|------|------|------|
| menu_id | bigint | 主键 |
| menu_name | varchar(50) | 菜单名称 |
| parent_id | bigint | 父菜单 ID |
| order_num | int | 显示顺序 |
| path | varchar(200) | 路由地址 |
| component | varchar(255) | 组件路径 |
| query | varchar(255) | 路由参数 |
| is_frame | int | 是否为外链 |
| is_cache | int | 是否缓存 |
| menu_type | char(1) | 类型（M 目录 C 菜单 F 按钮） |
| visible | char(1) | 显示状态 |
| status | char(1) | 状态 |
| perms | varchar(100) | 权限标识 |
| icon | varchar(100) | 图标 |

**部门表 (sys_dept)**

| 字段 | 类型 | 描述 |
|------|------|------|
| dept_id | bigint | 主键 |
| parent_id | bigint | 父部门 ID |
| ancestors | varchar(50) | 祖级列表 |
| dept_name | varchar(30) | 部门名称 |
| order_num | int | 显示顺序 |
| leader | varchar(20) | 负责人 |
| phone | varchar(11) | 联系电话 |
| email | varchar(50) | 邮箱 |
| status | char(1) | 状态 |

**岗位表 (sys_post)**

| 字段 | 类型 | 描述 |
|------|------|------|
| post_id | bigint | 主键 |
| post_code | varchar(64) | 岗位编码 |
| post_name | varchar(50) | 岗位名称 |
| post_sort | int | 显示顺序 |
| status | char(1) | 状态 |

**字典表 (sys_dict_type / sys_dict_data)**

| 表 | 用途 |
|---|------|
| sys_dict_type | 字典类型表 |
| sys_dict_data | 字典数据表（如性别、状态等枚举值） |

**操作日志表 (sys_oper_log)**

| 字段 | 类型 | 描述 |
|------|------|------|
| oper_id | bigint | 主键 |
| title | varchar(50) | 模块标题 |
| business_type | int | 业务类型 |
| method | varchar(100) | 方法名称 |
| request_method | varchar(10) | 请求方式 |
| operator_type | int | 操作类别 |
| oper_name | varchar(50) | 操作人员 |
| dept_name | varchar(50) | 部门名称 |
| oper_url | varchar(255) | 请求 URL |
| oper_ip | varchar(128) | 主机地址 |
| oper_location | varchar(255) | 操作地点 |
| oper_param | text | 请求参数 |
| json_result | text | 返回参数 |
| status | int | 操作状态 |
| error_msg | varchar(2000) | 错误消息 |
| oper_time | datetime | 操作时间 |
| cost_time | bigint | 消耗时间 |

**登录日志表 (sys_login_log)**

| 字段 | 类型 | 描述 |
|------|------|------|
| info_id | bigint | 主键 |
| user_name | varchar(50) | 用户名称 |
| ipaddr | varchar(128) | 登录 IP |
| login_location | varchar(255) | 登录地点 |
| browser | varchar(50) | 浏览器 |
| os | varchar(50) | 操作系统 |
| status | char(1) | 登录状态 |
| msg | varchar(255) | 提示消息 |
| login_time | datetime | 访问时间 |
| tenant_id | varchar(20) | 租户 ID |

**租户表 (sys_tenant)**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | varchar(20) | 主键 |
| tenant_id | varchar(20) | 租户编号 |
| contact_user_name | varchar(30) | 联系人 |
| contact_phone | varchar(30) | 联系电话 |
| company_name | varchar(30) | 企业名称 |
| license_number | varchar(30) | 统一信用代码 |
| address | varchar(200) | 地址 |
| logo | varchar(200) | Logo |
| intro | varchar(200) | 简介 |
| begin_time | datetime | 开始时间 |
| end_time | datetime | 结束时间 |
| status | char(1) | 状态 |
| package_id | bigint | 套餐 ID |
| expire_time | datetime | 过期时间 |
| account_count | int | 账户数量 |
| user_count | int | 现有用户数 |

**套餐表 (sys_package)**

| 字段 | 类型 | 描述 |
|------|------|------|
| package_id | bigint | 主键 |
| package_name | varchar(30) | 套餐名称 |
| menu_ids | text | 关联菜单 ID 列表 |
| status | char(1) | 状态 |

**文件表 (sys_file / sys_oss_config)**

| 表 | 用途 |
|---|------|
| sys_file | 文件记录表 |
| sys_oss_config | OSS 配置表（本地/阿里云/七牛云/腾讯云） |

**参数配置表 (sys_config)**

| 字段 | 类型 | 描述 |
|------|------|------|
| config_id | int | 主键 |
| config_name | varchar(100) | 参数名称 |
| config_key | varchar(100) | 参数键名 |
| config_value | varchar(500) | 参数键值 |
| config_type | char(1) | 系统内置（Y 是 N 否） |

**消息相关表**

| 表 | 用途 |
|---|------|
| sys_message | 消息表 |
| sys_message_record | 消息推送记录 |
| sys_notice | 通知公告表 |

**工作流相关表**

| 表 | 用途 |
|---|------|
| wf_category | 流程分类 |
| wf_definition | 流程定义 |
| wf_node | 流程节点 |
| wf_edge | 流程边 |
| wf_instance | 流程实例 |
| wf_task | 任务 |
| wf_operation_record | 操作记录 |
| wf_form_manage | 表单管理 |
| wf_copy | 抄送表 |

**报表相关表**

| 表 | 用途 |
|---|------|
| report_ge_tpl | 报表模板 |
| report_ge_tpl_datasource | 报表数据源 |
| report_ge_set_measure | 指标 |
| report_ge_set_dimension | 维度 |

**代码生成相关表**

| 表 | 用途 |
|---|------|
| gen_table | 代码生成表 |
| gen_table_column | 代码生成字段 |

### 1.3 数据库 ER 关系图

```
sys_tenant ────1:n──── sys_user
                 │         │
                 │         └── sys_user_post (n:n) ── sys_post
                 │
                 ├───────── sys_role (n:n via sys_user_role)
                 │
                 ├───────── sys_dept (tree)
                 │
                 └───────── sys_menu (tree)
                               │
                               ├── sys_role_menu (n:n)
                               └── sys_package_menu (n:n)

sys_user ────1:n──── sys_oper_log
sys_user ────1:n──── sys_login_log
```

### 1.4 多租户数据隔离策略

**隔离级别**：逻辑隔离（tenant_id 字段）

**所有业务表都包含 `tenant_id` 字段，查询时自动添加 `WHERE tenant_id = ?` 条件

**数据可见性规则**:

1. **租户管理员**: 仅可见本租户数据
2. **平台管理员**: 可见所有租户数据（特殊权限）
3. **普通用户**: 按角色权限过滤数据

---

## 二、缓存架构

### 2.1 缓存分层设计

```
┌─────────────────────────────────────────────────┐
│              L1: 浏览器缓存                      │
│  HTTP Cache-Control / LocalStorage              │
└────────────┬────────────────────────────────────┘
             │
    ┌────────▼────────────────────────────────────┐
    │        L2: 应用内缓存 (Pinia store)         │
    │  用户信息 / 菜单 / 字典                      │
    └────────┬────────────────────────────────────┘
             │
    ┌────────▼────────────────────────────────────┐
    │       L3: Redis 分布式缓存                   │
    │  Session / Token / 热点数据                  │
    └────────┬────────────────────────────────────┘
             │
    ┌────────▼────────────────────────────────────┐
    │       L4: 数据库持久化                       │
    │  PostgreSQL                                  │
    └─────────────────────────────────────────────┘
```

### 2.2 缓存策略

| 场景 | 缓存位置 | TTL | 策略 |
|------|---------|-----|------|
| 用户信息 | Pinia + Redis | 2h | 登录后加载，登出时清除 |
| 菜单树 | Pinia + Redis | 1h | 登录后加载，权限变更时清除 |
| 字典数据 | LocalStorage + Redis | 1d | 首次访问时加载，后台可刷新 |
| 参数配置 | Redis | 30min | 配置变更时主动刷新 |
| Token / Session | Redis | 2h | 滑动过期 |
| 操作日志 | 数据库 | 永久 | 不缓存 |
| 登录日志 | 数据库 | 永久 | 不缓存 |

### 2.3 缓存更新策略

**Cache-Aside Pattern（旁路缓存）**:

```
读操作:
1. 先读 Redis
2. 命中 → 返回
3. 未命中 → 读数据库
4. 写入 Redis → 返回

写操作:
1. 先写数据库
2. 使 Redis 缓存失效（删除 key）
3. 下次读取时重新加载
```

**Cache-Invalidation Events（缓存失效事件）**:

| 操作 | 触发的缓存失效 |
|------|--------------|
| 用户信息更新 | user:{id} |
| 角色权限变更 | role:{id}, user:menu:{id} |
| 菜单变更 | menu:tree |
| 部门变更 | dept:tree |
| 字典变更 | dict:{type} |
| 参数配置变更 | config:{key} |

### 2.4 缓存 Key 设计规范

```
格式: yunshu:{tenant_id}:{module}:{key}

示例:
- yunshu:tenant001:user:1001        (用户信息)
- yunshu:tenant001:menu:tree        (菜单树)
- yunshu:tenant001:dict:sys_user_sex (字典)
- yunshu:global:config:sys.index.title (全局配置)
- yunshu:tenant001:token:abc123      (Token)
```

### 2.5 分布式锁

```
场景:
1. 定时任务（避免多实例重复执行）
2. 并发资源竞争
3. 幂等性保证

实现:
- SETNX + EXPIRE (原子操作)
- 带超时时间（避免死锁）
- 随机值 + Lua 脚本（防止误删他人锁）
```

### 2.6 缓存穿透与雪崩防护

**缓存穿透**（查询不存在的数据）:
- 方案：缓存空值 + 布隆过滤器

**缓存击穿**（热点 key 过期瞬间大量请求）:
- 方案：互斥锁 + 永不过期（后台异步更新）

**缓存雪崩**（大量 key 同时过期）:
- 方案：TTL 随机化 + 分级缓存 + 多级缓存

---

## 三、索引设计

### 3.1 常用索引类型

```sql
-- 主键索引（自动创建）
PRIMARY KEY (user_id)

-- 唯一索引
CREATE UNIQUE INDEX uk_user_name ON sys_user(user_name, tenant_id);
CREATE UNIQUE INDEX uk_role_key ON sys_role(role_key, tenant_id);

-- 组合索引
CREATE INDEX idx_oper_time ON sys_oper_log(oper_time DESC);
CREATE INDEX idx_login_time ON sys_login_log(login_time DESC);
CREATE INDEX idx_tenant_user ON sys_user(tenant_id, user_name);

-- GIN 索引（JSON 字段）
CREATE INDEX idx_user_extra ON sys_user USING GIN (extra_info);
```

### 3.2 索引使用原则

1. **选择性高的字段优先**（如 user_name, phone）
2. **避免对频繁更新的字段建索引**
3. **组合索引遵循最左前缀原则**
4. **小表不需要索引**（< 1000 行）
5. **定期分析慢查询**，按需添加索引

---

## 四、事务与并发控制

### 4.1 事务隔离级别

```sql
-- 默认: READ COMMITTED
-- 适用场景:
--   1. 用户更新操作
--   2. 工作流状态流转
--   3. 订单状态变更
```

### 4.2 乐观锁

```sql
-- 版本号机制
UPDATE sys_user
SET status = 1, version = version + 1
WHERE user_id = #{userId} AND version = #{oldVersion}
```

### 4.3 数据版本管理

- 关键数据保留历史版本（如流程定义）
- 删除操作优先软删除（逻辑删除）
- 保留创建时间和更新时间字段

---

## 五、备份与恢复

### 5.1 备份策略

| 类型 | 频率 | 保留期 |
|------|------|--------|
| 全量备份 | 每日 02:00 | 30 天 |
| 增量备份 | 每小时 | 7 天 |
| WAL 日志 | 持续归档 | 7 天 |

### 5.2 Redis 持久化

```
RDB（快照）: 每 5 分钟
AOF（追加文件）: everysec（每秒）
```

---

## 六、性能优化建议

1. **查询优化**:
   - 避免 `SELECT *`，按需选择字段
   - 使用 `LIMIT` 分页
   - 复杂查询拆分为多个简单查询

2. **连接池配置**:
   - 根据实际并发配置连接池大小
   - 设置合理的超时时间

3. **读写分离**（高并发场景）:
   - 主库负责写
   - 从库负责读
   - 业务可接受主从延迟

4. **分库分表**（超大数据量）:
   - 操作日志/登录日志按时间分表
   - 按租户 ID 分库

---

## 七、开发规范

### 7.1 SQL 编写规范

- 关键字大写：`SELECT`, `INSERT`, `UPDATE`, `DELETE`
- 表名/字段名使用蛇形命名：`sys_user`, `user_name`
- 禁止 `SELECT *`
- 必须显式指定字段

### 7.2 禁止项

- 禁止在循环中执行数据库操作（N+1 问题）
- 禁止使用 `LIKE '%xxx%'` 全表扫描（可用全文索引替代）
- 禁止大事务（超过 10s）
- 禁止无 `WHERE` 条件的 `UPDATE/DELETE`

---

**相关文档**:
- [系统架构总览](architecture.md)
- [权限体系设计](permission.md)
- [多租户架构](multi-tenant.md)

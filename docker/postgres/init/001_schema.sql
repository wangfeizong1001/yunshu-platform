-- =====================================================================
-- PostgreSQL 16 数据库初始化脚本
-- 中台系统（简化版 RuoYi 框架）数据库结构
-- 编码：UTF-8
-- =====================================================================

-- ---------------------------------------------------------------------
-- 一、启用扩展
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 二、设置时区
-- ---------------------------------------------------------------------
SET TIME ZONE 'Asia/Shanghai';

-- =====================================================================
-- 三、触发器函数：自动更新 updated_at
-- =====================================================================

-- 创建通用的 updated_at 触发器函数
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 四、数据表定义（按依赖顺序）
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. sys_dept - 部门表
-- ---------------------------------------------------------------------
CREATE TABLE sys_dept (
    dept_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID          NULL,
    ancestors   VARCHAR(50)   NULL,
    dept_name   VARCHAR(50)   NOT NULL,
    order_num   INT           DEFAULT 0,
    leader      VARCHAR(50)   NULL,
    phone       VARCHAR(20)   NULL,
    email       VARCHAR(100)  NULL,
    status      VARCHAR(1)    DEFAULT '0',
    tenant_id   VARCHAR(20)   NULL,
    created_by  VARCHAR(64)   DEFAULT '',
    updated_by  VARCHAR(64)   DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP     NULL
);

COMMENT ON TABLE  sys_dept           IS '部门表';
COMMENT ON COLUMN sys_dept.dept_id   IS '部门主键 ID';
COMMENT ON COLUMN sys_dept.parent_id IS '父部门 ID（顶层为 NULL）';
COMMENT ON COLUMN sys_dept.ancestors IS '祖级列表（逗号分隔）';
COMMENT ON COLUMN sys_dept.dept_name IS '部门名称';
COMMENT ON COLUMN sys_dept.order_num IS '排序';
COMMENT ON COLUMN sys_dept.leader    IS '负责人';
COMMENT ON COLUMN sys_dept.phone     IS '联系电话';
COMMENT ON COLUMN sys_dept.email     IS '邮箱';
COMMENT ON COLUMN sys_dept.status    IS '状态（0 正常 / 1 停用）';
COMMENT ON COLUMN sys_dept.tenant_id IS '租户 ID';

-- 自引用外键（部门父子关系）
ALTER TABLE sys_dept
    ADD CONSTRAINT fk_sys_dept_parent
    FOREIGN KEY (parent_id) REFERENCES sys_dept(dept_id)
    ON DELETE SET NULL;

-- 常用查询索引
CREATE INDEX idx_sys_dept_parent    ON sys_dept(parent_id);
CREATE INDEX idx_sys_dept_tenant    ON sys_dept(tenant_id);

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_dept_updated_at
BEFORE UPDATE ON sys_dept
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 2. sys_user - 用户表
-- ---------------------------------------------------------------------
CREATE TABLE sys_user (
    user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_id     UUID          NULL,
    user_name   VARCHAR(30)   NOT NULL,
    nick_name   VARCHAR(30)   DEFAULT '',
    user_type   VARCHAR(2)    DEFAULT '00',
    email       VARCHAR(50)   DEFAULT '',
    phone       VARCHAR(20)   DEFAULT '',
    sex         VARCHAR(1)    DEFAULT '2',
    avatar      VARCHAR(100)  DEFAULT '',
    password    VARCHAR(100)  NOT NULL,
    status      VARCHAR(1)    DEFAULT '0',
    remark      VARCHAR(500)  DEFAULT '',
    tenant_id   VARCHAR(20)   NULL,
    login_ip    VARCHAR(128)  DEFAULT '',
    login_date  TIMESTAMP     NULL,
    created_by  VARCHAR(64)   DEFAULT '',
    updated_by  VARCHAR(64)   DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP     NULL,
    CONSTRAINT uk_sys_user_user_name UNIQUE (user_name)
);

COMMENT ON TABLE  sys_user           IS '用户信息表';
COMMENT ON COLUMN sys_user.user_id   IS '用户主键 ID';
COMMENT ON COLUMN sys_user.dept_id   IS '部门 ID';
COMMENT ON COLUMN sys_user.user_name IS '登录账号';
COMMENT ON COLUMN sys_user.nick_name IS '用户昵称';
COMMENT ON COLUMN sys_user.user_type IS '用户类型（00 系统用户）';
COMMENT ON COLUMN sys_user.email     IS '邮箱';
COMMENT ON COLUMN sys_user.phone     IS '手机号';
COMMENT ON COLUMN sys_user.sex       IS '性别（0 男 / 1 女 / 2 未知）';
COMMENT ON COLUMN sys_user.avatar    IS '头像地址';
COMMENT ON COLUMN sys_user.password  IS '密码（bcrypt 哈希）';
COMMENT ON COLUMN sys_user.status    IS '状态（0 正常 / 1 停用）';
COMMENT ON COLUMN sys_user.tenant_id IS '租户 ID';
COMMENT ON COLUMN sys_user.login_ip  IS '最后登录 IP';
COMMENT ON COLUMN sys_user.login_date IS '最后登录时间';

-- 外键
ALTER TABLE sys_user
    ADD CONSTRAINT fk_sys_user_dept
    FOREIGN KEY (dept_id) REFERENCES sys_dept(dept_id)
    ON DELETE SET NULL;

-- 常用查询索引
CREATE INDEX idx_sys_user_user_name ON sys_user(user_name);
CREATE INDEX idx_sys_user_dept      ON sys_user(dept_id);
CREATE INDEX idx_sys_user_tenant    ON sys_user(tenant_id);
CREATE INDEX idx_sys_user_status    ON sys_user(status);

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_user_updated_at
BEFORE UPDATE ON sys_user
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 3. sys_role - 角色表
-- ---------------------------------------------------------------------
CREATE TABLE sys_role (
    role_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name   VARCHAR(30)   NOT NULL,
    role_key    VARCHAR(100)  NOT NULL,
    role_sort   INT           NOT NULL,
    data_scope  VARCHAR(1)    DEFAULT '1',
    status      VARCHAR(1)    DEFAULT '0',
    remark      VARCHAR(500)  DEFAULT '',
    tenant_id   VARCHAR(20)   NULL,
    created_by  VARCHAR(64)   DEFAULT '',
    updated_by  VARCHAR(64)   DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP     NULL,
    CONSTRAINT uk_sys_role_role_key UNIQUE (role_key)
);

COMMENT ON TABLE  sys_role            IS '角色表';
COMMENT ON COLUMN sys_role.role_id    IS '角色主键 ID';
COMMENT ON COLUMN sys_role.role_name  IS '角色名称';
COMMENT ON COLUMN sys_role.role_key   IS '角色权限字符串（如 admin）';
COMMENT ON COLUMN sys_role.role_sort  IS '排序';
COMMENT ON COLUMN sys_role.data_scope IS '数据范围（1 全部 / 2 本部门 / 3 本部门及以下 / 4 本人 / 5 自定义）';
COMMENT ON COLUMN sys_role.status     IS '状态（0 正常 / 1 停用）';
COMMENT ON COLUMN sys_role.tenant_id  IS '租户 ID';

-- 常用查询索引
CREATE INDEX idx_sys_role_role_key ON sys_role(role_key);
CREATE INDEX idx_sys_role_tenant   ON sys_role(tenant_id);

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_role_updated_at
BEFORE UPDATE ON sys_role
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 4. sys_menu - 菜单表
-- ---------------------------------------------------------------------
CREATE TABLE sys_menu (
    menu_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_name   VARCHAR(50)   NOT NULL,
    parent_id   UUID          NULL,
    order_num   INT           DEFAULT 0,
    path        VARCHAR(200)  DEFAULT '',
    component   VARCHAR(255)  DEFAULT '',
    query       VARCHAR(255)  DEFAULT '',
    is_frame    VARCHAR(1)    DEFAULT '1',
    is_cache    VARCHAR(1)    DEFAULT '0',
    menu_type   VARCHAR(1)    DEFAULT '',
    visible     VARCHAR(1)    DEFAULT '0',
    status      VARCHAR(1)    DEFAULT '0',
    perms       VARCHAR(100)  DEFAULT '',
    icon        VARCHAR(100)  DEFAULT '#',
    remark      VARCHAR(500)  DEFAULT '',
    created_by  VARCHAR(64)   DEFAULT '',
    updated_by  VARCHAR(64)   DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP     NULL
);

COMMENT ON TABLE  sys_menu            IS '菜单表';
COMMENT ON COLUMN sys_menu.menu_id    IS '菜单主键 ID';
COMMENT ON COLUMN sys_menu.menu_name  IS '菜单名称';
COMMENT ON COLUMN sys_menu.parent_id  IS '父菜单 ID';
COMMENT ON COLUMN sys_menu.order_num  IS '排序';
COMMENT ON COLUMN sys_menu.path       IS '路由地址';
COMMENT ON COLUMN sys_menu.component  IS '组件路径';
COMMENT ON COLUMN sys_menu.query      IS '路由参数';
COMMENT ON COLUMN sys_menu.is_frame   IS '是否外链（0 外链 / 1 内链）';
COMMENT ON COLUMN sys_menu.is_cache   IS '是否缓存（0 缓存 / 1 不缓存）';
COMMENT ON COLUMN sys_menu.menu_type  IS '菜单类型（M 目录 / C 菜单 / F 按钮）';
COMMENT ON COLUMN sys_menu.visible    IS '显示状态（0 显示 / 1 隐藏）';
COMMENT ON COLUMN sys_menu.status     IS '状态（0 正常 / 1 停用）';
COMMENT ON COLUMN sys_menu.perms      IS '权限标识';
COMMENT ON COLUMN sys_menu.icon       IS '菜单图标';

-- 自引用外键（菜单父子关系）
ALTER TABLE sys_menu
    ADD CONSTRAINT fk_sys_menu_parent
    FOREIGN KEY (parent_id) REFERENCES sys_menu(menu_id)
    ON DELETE SET NULL;

-- 常用查询索引
CREATE INDEX idx_sys_menu_parent    ON sys_menu(parent_id);
CREATE INDEX idx_sys_menu_menu_type ON sys_menu(menu_type);
CREATE INDEX idx_sys_menu_status    ON sys_menu(status);

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_menu_updated_at
BEFORE UPDATE ON sys_menu
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 5. sys_post - 岗位表
-- ---------------------------------------------------------------------
CREATE TABLE sys_post (
    post_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_code   VARCHAR(64)   NOT NULL,
    post_name   VARCHAR(50)   NOT NULL,
    post_sort   INT           NOT NULL,
    status      VARCHAR(1)    DEFAULT '0',
    remark      VARCHAR(500)  DEFAULT '',
    created_by  VARCHAR(64)   DEFAULT '',
    updated_by  VARCHAR(64)   DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP     NULL,
    CONSTRAINT uk_sys_post_post_code UNIQUE (post_code)
);

COMMENT ON TABLE  sys_post            IS '岗位表';
COMMENT ON COLUMN sys_post.post_id    IS '岗位主键 ID';
COMMENT ON COLUMN sys_post.post_code  IS '岗位编码';
COMMENT ON COLUMN sys_post.post_name  IS '岗位名称';
COMMENT ON COLUMN sys_post.post_sort  IS '排序';
COMMENT ON COLUMN sys_post.status     IS '状态（0 正常 / 1 停用）';

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_post_updated_at
BEFORE UPDATE ON sys_post
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 6. sys_user_role - 用户角色关联表（多对多）
-- ---------------------------------------------------------------------
CREATE TABLE sys_user_role (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

COMMENT ON TABLE sys_user_role IS '用户角色关联表';

ALTER TABLE sys_user_role
    ADD CONSTRAINT fk_sys_user_role_user
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
    ON DELETE CASCADE;

ALTER TABLE sys_user_role
    ADD CONSTRAINT fk_sys_user_role_role
    FOREIGN KEY (role_id) REFERENCES sys_role(role_id)
    ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- 7. sys_role_menu - 角色菜单关联表
-- ---------------------------------------------------------------------
CREATE TABLE sys_role_menu (
    role_id UUID NOT NULL,
    menu_id UUID NOT NULL,
    PRIMARY KEY (role_id, menu_id)
);

COMMENT ON TABLE sys_role_menu IS '角色菜单关联表';

ALTER TABLE sys_role_menu
    ADD CONSTRAINT fk_sys_role_menu_role
    FOREIGN KEY (role_id) REFERENCES sys_role(role_id)
    ON DELETE CASCADE;

ALTER TABLE sys_role_menu
    ADD CONSTRAINT fk_sys_role_menu_menu
    FOREIGN KEY (menu_id) REFERENCES sys_menu(menu_id)
    ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- 8. sys_role_dept - 角色部门关联表（数据权限）
-- ---------------------------------------------------------------------
CREATE TABLE sys_role_dept (
    role_id UUID NOT NULL,
    dept_id UUID NOT NULL,
    PRIMARY KEY (role_id, dept_id)
);

COMMENT ON TABLE sys_role_dept IS '角色部门关联表（数据权限）';

ALTER TABLE sys_role_dept
    ADD CONSTRAINT fk_sys_role_dept_role
    FOREIGN KEY (role_id) REFERENCES sys_role(role_id)
    ON DELETE CASCADE;

ALTER TABLE sys_role_dept
    ADD CONSTRAINT fk_sys_role_dept_dept
    FOREIGN KEY (dept_id) REFERENCES sys_dept(dept_id)
    ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- 9. sys_user_post - 用户岗位关联表
-- ---------------------------------------------------------------------
CREATE TABLE sys_user_post (
    user_id UUID NOT NULL,
    post_id UUID NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

COMMENT ON TABLE sys_user_post IS '用户岗位关联表';

ALTER TABLE sys_user_post
    ADD CONSTRAINT fk_sys_user_post_user
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id)
    ON DELETE CASCADE;

ALTER TABLE sys_user_post
    ADD CONSTRAINT fk_sys_user_post_post
    FOREIGN KEY (post_id) REFERENCES sys_post(post_id)
    ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- 10. sys_job - 定时任务表
-- ---------------------------------------------------------------------
CREATE TABLE sys_job (
    job_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name        VARCHAR(64)     NOT NULL DEFAULT '',
    job_group       VARCHAR(64)     NOT NULL DEFAULT 'DEFAULT',
    invoke_target   VARCHAR(500)    NOT NULL,
    cron_expression VARCHAR(255)    DEFAULT '',
    misfire_policy  VARCHAR(20)     DEFAULT '3',
    concurrent      VARCHAR(1)      DEFAULT '1',
    status          VARCHAR(1)      DEFAULT '0',
    remark          VARCHAR(500)    DEFAULT '',
    created_by      VARCHAR(64)     DEFAULT '',
    updated_by      VARCHAR(64)     DEFAULT '',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP       NULL,
    CONSTRAINT uk_sys_job_name_group UNIQUE (job_name, job_group)
);

COMMENT ON TABLE  sys_job                IS '定时任务表';
COMMENT ON COLUMN sys_job.job_id         IS '任务主键 ID';
COMMENT ON COLUMN sys_job.job_name       IS '任务名称';
COMMENT ON COLUMN sys_job.job_group      IS '任务组名';
COMMENT ON COLUMN sys_job.invoke_target  IS '调用目标字符串';
COMMENT ON COLUMN sys_job.cron_expression IS 'cron 执行表达式';
COMMENT ON COLUMN sys_job.misfire_policy IS '计划执行错误策略（1 立即 / 2 等待 / 3 放弃）';
COMMENT ON COLUMN sys_job.concurrent     IS '是否并发（0 允许 / 1 禁止）';
COMMENT ON COLUMN sys_job.status         IS '状态（0 正常 / 1 暂停）';

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_job_updated_at
BEFORE UPDATE ON sys_job
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 11. sys_job_log - 定时任务日志
-- ---------------------------------------------------------------------
CREATE TABLE sys_job_log (
    job_log_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name      VARCHAR(64)  NOT NULL,
    job_group     VARCHAR(64)  NOT NULL,
    invoke_target VARCHAR(500) DEFAULT '',
    job_message   VARCHAR(500) DEFAULT '',
    status        VARCHAR(1)   DEFAULT '0',
    exception_info VARCHAR(2000) DEFAULT '',
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  sys_job_log              IS '定时任务日志';
COMMENT ON COLUMN sys_job_log.job_log_id   IS '日志主键 ID';
COMMENT ON COLUMN sys_job_log.job_name     IS '任务名称';
COMMENT ON COLUMN sys_job_log.job_group    IS '任务组名';
COMMENT ON COLUMN sys_job_log.status       IS '状态（0 成功 / 1 失败）';

-- 常用查询索引
CREATE INDEX idx_sys_job_log_created_at ON sys_job_log(created_at);
CREATE INDEX idx_sys_job_log_job_name   ON sys_job_log(job_name);

-- ---------------------------------------------------------------------
-- 12. sys_oper_log - 操作日志
-- ---------------------------------------------------------------------
CREATE TABLE sys_oper_log (
    oper_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(50)   DEFAULT '',
    business_type  INT           DEFAULT 0,
    method         VARCHAR(100)  DEFAULT '',
    request_method VARCHAR(10)   DEFAULT '',
    operator_type  INT           DEFAULT 0,
    oper_name      VARCHAR(50)   DEFAULT '',
    dept_name      VARCHAR(50)   DEFAULT '',
    oper_url       VARCHAR(255)  DEFAULT '',
    oper_ip        VARCHAR(128)  DEFAULT '',
    oper_location  VARCHAR(255)  DEFAULT '',
    oper_param     TEXT          DEFAULT '',
    json_result    TEXT          DEFAULT '',
    status         INT           DEFAULT 0,
    error_msg      VARCHAR(2000) DEFAULT '',
    cost_time      INT           DEFAULT 0,
    oper_time      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  sys_oper_log              IS '操作日志';
COMMENT ON COLUMN sys_oper_log.oper_id      IS '日志主键 ID';
COMMENT ON COLUMN sys_oper_log.title        IS '模块标题';
COMMENT ON COLUMN sys_oper_log.business_type IS '业务类型（0 其它 / 1 新增 / 2 修改 / 3 删除）';
COMMENT ON COLUMN sys_oper_log.operator_type IS '操作类别（0 其它 / 1 后台 / 2 手机端）';
COMMENT ON COLUMN sys_oper_log.oper_name    IS '操作人员';
COMMENT ON COLUMN sys_oper_log.status       IS '状态（0 正常 / 1 异常）';

-- 常用查询索引
CREATE INDEX idx_sys_oper_log_oper_time ON sys_oper_log(oper_time);
CREATE INDEX idx_sys_oper_log_oper_name ON sys_oper_log(oper_name);

-- ---------------------------------------------------------------------
-- 13. sys_login_log - 登录日志
-- ---------------------------------------------------------------------
CREATE TABLE sys_login_log (
    info_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name      VARCHAR(50)   DEFAULT '',
    ipaddr         VARCHAR(128)  DEFAULT '',
    login_location VARCHAR(255)  DEFAULT '',
    browser        VARCHAR(50)   DEFAULT '',
    os             VARCHAR(50)   DEFAULT '',
    status         VARCHAR(1)    DEFAULT '0',
    msg            VARCHAR(255)  DEFAULT '',
    login_time     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  sys_login_log              IS '登录日志';
COMMENT ON COLUMN sys_login_log.info_id      IS '日志主键 ID';
COMMENT ON COLUMN sys_login_log.user_name    IS '用户账号';
COMMENT ON COLUMN sys_login_log.status       IS '状态（0 成功 / 1 失败）';

-- 常用查询索引
CREATE INDEX idx_sys_login_log_login_time ON sys_login_log(login_time);
CREATE INDEX idx_sys_login_log_user_name  ON sys_login_log(user_name);

-- ---------------------------------------------------------------------
-- 14. sys_notice - 通知公告
-- ---------------------------------------------------------------------
CREATE TABLE sys_notice (
    notice_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_title  VARCHAR(50)   NOT NULL,
    notice_type   VARCHAR(1)    DEFAULT '1',
    notice_content TEXT         DEFAULT '',
    status        VARCHAR(1)    DEFAULT '0',
    remark        VARCHAR(500)  DEFAULT '',
    created_by    VARCHAR(64)   DEFAULT '',
    updated_by    VARCHAR(64)   DEFAULT '',
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP     NULL
);

COMMENT ON TABLE  sys_notice               IS '通知公告';
COMMENT ON COLUMN sys_notice.notice_id     IS '公告主键 ID';
COMMENT ON COLUMN sys_notice.notice_title  IS '标题';
COMMENT ON COLUMN sys_notice.notice_type   IS '类型（1 通知 / 2 公告）';
COMMENT ON COLUMN sys_notice.status        IS '状态（0 正常 / 1 关闭）';

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_notice_updated_at
BEFORE UPDATE ON sys_notice
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 15. sys_config - 参数配置
-- ---------------------------------------------------------------------
CREATE TABLE sys_config (
    config_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_name  VARCHAR(100)  DEFAULT '',
    config_key   VARCHAR(100)  NOT NULL,
    config_value VARCHAR(500)  DEFAULT '',
    config_type  VARCHAR(1)    DEFAULT 'N',
    remark       VARCHAR(500)  DEFAULT '',
    created_by   VARCHAR(64)   DEFAULT '',
    updated_by   VARCHAR(64)   DEFAULT '',
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at   TIMESTAMP     NULL,
    CONSTRAINT uk_sys_config_config_key UNIQUE (config_key)
);

COMMENT ON TABLE  sys_config               IS '参数配置';
COMMENT ON COLUMN sys_config.config_id     IS '参数主键 ID';
COMMENT ON COLUMN sys_config.config_name   IS '参数名称';
COMMENT ON COLUMN sys_config.config_key    IS '参数键';
COMMENT ON COLUMN sys_config.config_value  IS '参数值';
COMMENT ON COLUMN sys_config.config_type   IS '类型（Y 系统内置 / N 非内置）';

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_config_updated_at
BEFORE UPDATE ON sys_config
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 16. sys_dict_type - 字典类型
-- ---------------------------------------------------------------------
CREATE TABLE sys_dict_type (
    dict_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dict_name   VARCHAR(100)  DEFAULT '',
    dict_type   VARCHAR(100)  NOT NULL,
    status      VARCHAR(1)    DEFAULT '0',
    remark      VARCHAR(500)  DEFAULT '',
    created_by  VARCHAR(64)   DEFAULT '',
    updated_by  VARCHAR(64)   DEFAULT '',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP     NULL,
    CONSTRAINT uk_sys_dict_type UNIQUE (dict_type)
);

COMMENT ON TABLE  sys_dict_type             IS '字典类型';
COMMENT ON COLUMN sys_dict_type.dict_id    IS '字典主键 ID';
COMMENT ON COLUMN sys_dict_type.dict_name  IS '字典名称';
COMMENT ON COLUMN sys_dict_type.dict_type  IS '字典类型';

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_dict_type_updated_at
BEFORE UPDATE ON sys_dict_type
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 17. sys_dict_data - 字典数据
-- ---------------------------------------------------------------------
CREATE TABLE sys_dict_data (
    dict_code  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dict_sort  INT           DEFAULT 0,
    dict_label VARCHAR(100)  DEFAULT '',
    dict_value VARCHAR(100)  DEFAULT '',
    dict_type  VARCHAR(100)  NOT NULL,
    css_class  VARCHAR(100)  DEFAULT '',
    list_class VARCHAR(100)  DEFAULT '',
    is_default VARCHAR(1)    DEFAULT 'N',
    status     VARCHAR(1)    DEFAULT '0',
    remark     VARCHAR(500)  DEFAULT '',
    created_by VARCHAR(64)   DEFAULT '',
    updated_by VARCHAR(64)   DEFAULT '',
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP     NULL
);

COMMENT ON TABLE  sys_dict_data              IS '字典数据';
COMMENT ON COLUMN sys_dict_data.dict_code    IS '字典编码';
COMMENT ON COLUMN sys_dict_data.dict_label   IS '字典标签';
COMMENT ON COLUMN sys_dict_data.dict_value   IS '字典键值';
COMMENT ON COLUMN sys_dict_data.dict_type    IS '字典类型（引用 sys_dict_type.dict_type）';
COMMENT ON COLUMN sys_dict_data.list_class   IS '表格回显样式';
COMMENT ON COLUMN sys_dict_data.is_default   IS '是否默认（Y 是 / N 否）';

-- 字典类型外键
ALTER TABLE sys_dict_data
    ADD CONSTRAINT fk_sys_dict_data_type
    FOREIGN KEY (dict_type) REFERENCES sys_dict_type(dict_type)
    ON DELETE CASCADE;

-- 常用查询索引
CREATE INDEX idx_sys_dict_data_type ON sys_dict_data(dict_type);

-- 自动更新 updated_at 触发器
CREATE TRIGGER trg_sys_dict_data_updated_at
BEFORE UPDATE ON sys_dict_data
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================================
-- 五、初始数据
-- =====================================================================

-- ---------------------------------------------------------------------
-- 5.1 部门数据
-- ---------------------------------------------------------------------
INSERT INTO sys_dept (dept_id, parent_id, ancestors, dept_name, order_num, leader, status, created_by)
VALUES ('00000000-0000-0000-0000-000000000001', NULL, '0', '总公司', 0, '张三', '0', 'admin');

-- ---------------------------------------------------------------------
-- 5.2 岗位数据
-- ---------------------------------------------------------------------
INSERT INTO sys_post (post_id, post_code, post_name, post_sort, status, created_by) VALUES
    ('10000000-0000-0000-0000-000000000001', 'ceo',     '董事长', 1, '0', 'admin'),
    ('10000000-0000-0000-0000-000000000002', 'pm',      '项目经理', 2, '0', 'admin'),
    ('10000000-0000-0000-0000-000000000003', 'lead',    '主管',   3, '0', 'admin'),
    ('10000000-0000-0000-0000-000000000004', 'employee','员工',   4, '0', 'admin');

-- ---------------------------------------------------------------------
-- 5.3 角色数据
-- ---------------------------------------------------------------------
INSERT INTO sys_role (role_id, role_name, role_key, role_sort, data_scope, status, remark, created_by)
VALUES ('20000000-0000-0000-0000-000000000001', '超级管理员', 'admin', 1, '1', '0', '超级管理员角色，拥有全部权限', 'admin');

-- ---------------------------------------------------------------------
-- 5.4 用户数据（admin / admin123）
-- ---------------------------------------------------------------------
INSERT INTO sys_user (user_id, dept_id, user_name, nick_name, user_type, password, status, remark, created_by)
VALUES (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin',
    '超级管理员',
    '00',
    '$2b$10$VEoI9DkPZ2TQ8M.9FZ8pGOdLHvW6lL5wYFhIcWzJtXq1aX4d3s5u2',
    '0',
    '超级管理员账号',
    'admin'
);

-- ---------------------------------------------------------------------
-- 5.5 用户-角色关联
-- ---------------------------------------------------------------------
INSERT INTO sys_user_role (user_id, role_id)
VALUES ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001');

-- ---------------------------------------------------------------------
-- 5.6 菜单数据
-- ---------------------------------------------------------------------
-- 一级目录
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path, component, menu_type, visible, status, perms, icon, created_by) VALUES
    ('40000000-0000-0000-0000-000000000001', '系统管理', NULL, 1, 'system',  '',          'M', '0', '0', '',            'setting', 'admin'),
    ('40000000-0000-0000-0000-000000000002', '系统监控', NULL, 2, 'monitor', '',          'M', '0', '0', '',            'chart',   'admin'),
    ('40000000-0000-0000-0000-000000000003', '系统工具', NULL, 3, 'tool',    '',          'M', '0', '0', '',            'tool',    'admin');

-- 系统管理二级菜单
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path,       component,         menu_type, visible, status, perms,               icon, created_by) VALUES
    ('40000000-0000-0000-0000-000000000010', '用户管理', '40000000-0000-0000-0000-000000000001', 1, 'user',     'system/user/index',     'C', '0', '0', 'system:user:list',     'user',     'admin'),
    ('40000000-0000-0000-0000-000000000011', '角色管理', '40000000-0000-0000-0000-000000000001', 2, 'role',     'system/role/index',     'C', '0', '0', 'system:role:list',     'peoples',  'admin'),
    ('40000000-0000-0000-0000-000000000012', '菜单管理', '40000000-0000-0000-0000-000000000001', 3, 'menu',     'system/menu/index',     'C', '0', '0', 'system:menu:list',     'menu',     'admin'),
    ('40000000-0000-0000-0000-000000000013', '部门管理', '40000000-0000-0000-0000-000000000001', 4, 'dept',     'system/dept/index',     'C', '0', '0', 'system:dept:list',     'tree',     'admin'),
    ('40000000-0000-0000-0000-000000000014', '岗位管理', '40000000-0000-0000-0000-000000000001', 5, 'post',     'system/post/index',     'C', '0', '0', 'system:post:list',     'post',     'admin'),
    ('40000000-0000-0000-0000-000000000015', '字典管理', '40000000-0000-0000-0000-000000000001', 6, 'dict',     'system/dict/index',     'C', '0', '0', 'system:dict:list',     'dict',     'admin'),
    ('40000000-0000-0000-0000-000000000016', '参数配置', '40000000-0000-0000-0000-000000000001', 7, 'config',   'system/config/index',   'C', '0', '0', 'system:config:list',   'edit',     'admin'),
    ('40000000-0000-0000-0000-000000000017', '通知公告', '40000000-0000-0000-0000-000000000001', 8, 'notice',   'system/notice/index',   'C', '0', '0', 'system:notice:list',   'message',  'admin');

-- 系统监控二级菜单
INSERT INTO sys_menu (menu_id, menu_name, parent_id, order_num, path,        component,              menu_type, visible, status, perms,              icon, created_by) VALUES
    ('40000000-0000-0000-0000-000000000020', '操作日志', '40000000-0000-0000-0000-000000000002', 1, 'operlog',    'monitor/operlog/index',    'C', '0', '0', 'monitor:operlog:list',    'form',   'admin'),
    ('40000000-0000-0000-0000-000000000021', '登录日志', '40000000-0000-0000-0000-000000000002', 2, 'logininfor', 'monitor/logininfor/index', 'C', '0', '0', 'monitor:logininfor:list', 'logininfor', 'admin'),
    ('40000000-0000-0000-0000-000000000022', '定时任务', '40000000-0000-0000-0000-000000000003', 1, 'job',        'monitor/job/index',        'C', '0', '0', 'monitor:job:list',        'job',    'admin');

-- ---------------------------------------------------------------------
-- 5.7 角色-菜单关联（admin 拥有全部菜单）
-- ---------------------------------------------------------------------
INSERT INTO sys_role_menu (role_id, menu_id)
    SELECT '20000000-0000-0000-0000-000000000001', menu_id FROM sys_menu;

-- ---------------------------------------------------------------------
-- 5.8 字典类型
-- ---------------------------------------------------------------------
INSERT INTO sys_dict_type (dict_id, dict_name, dict_type, status, remark, created_by) VALUES
    ('50000000-0000-0000-0000-000000000001', '用户性别', 'sys_user_sex',    '0', '用户性别列表', 'admin'),
    ('50000000-0000-0000-0000-000000000002', '状态',     'sys_normal_disable', '0', '通用状态列表', 'admin'),
    ('50000000-0000-0000-0000-000000000003', '是否',     'sys_yes_no',      '0', '通用是否列表', 'admin'),
    ('50000000-0000-0000-0000-000000000004', '开关',     'sys_show_hide',   '0', '通用开关列表', 'admin');

-- ---------------------------------------------------------------------
-- 5.9 字典数据
-- ---------------------------------------------------------------------
INSERT INTO sys_dict_data (dict_code, dict_sort, dict_label, dict_value, dict_type, list_class, is_default, status, created_by) VALUES
    -- 性别
    ('60000000-0000-0000-0000-000000000001', 1, '男',   '0', 'sys_user_sex',      '',         'Y', '0', 'admin'),
    ('60000000-0000-0000-0000-000000000002', 2, '女',   '1', 'sys_user_sex',      '',         'N', '0', 'admin'),
    ('60000000-0000-0000-0000-000000000003', 3, '未知', '2', 'sys_user_sex',      '',         'N', '0', 'admin'),
    -- 状态
    ('60000000-0000-0000-0000-000000000004', 1, '正常', '0', 'sys_normal_disable','primary',  'Y', '0', 'admin'),
    ('60000000-0000-0000-0000-000000000005', 2, '停用', '1', 'sys_normal_disable','danger',   'N', '0', 'admin'),
    -- 是否
    ('60000000-0000-0000-0000-000000000006', 1, '是',   'Y', 'sys_yes_no',        'primary',  'Y', '0', 'admin'),
    ('60000000-0000-0000-0000-000000000007', 2, '否',   'N', 'sys_yes_no',        'danger',   'N', '0', 'admin'),
    -- 开关
    ('60000000-0000-0000-0000-000000000008', 1, '显示', '0', 'sys_show_hide',     'primary',  'Y', '0', 'admin'),
    ('60000000-0000-0000-0000-000000000009', 2, '隐藏', '1', 'sys_show_hide',     'danger',   'N', '0', 'admin');

-- ---------------------------------------------------------------------
-- 5.10 参数配置
-- ---------------------------------------------------------------------
INSERT INTO sys_config (config_id, config_name, config_key, config_value, config_type, remark, created_by) VALUES
    ('70000000-0000-0000-0000-000000000001', '主框架页-默认皮肤', 'sys.index.skinName',       'skin-blue',       'Y', '默认皮肤样式', 'admin'),
    ('70000000-0000-0000-0000-000000000002', '是否开启验证码',    'sys.account.captchaEnabled','true',            'Y', '是否开启登录验证码（true 开启 / false 关闭）', 'admin'),
    ('70000000-0000-0000-0000-000000000003', '账号初始密码',      'sys.user.initPassword',    '123456',          'Y', '新建用户初始密码', 'admin');

-- ---------------------------------------------------------------------
-- 5.11 通知公告
-- ---------------------------------------------------------------------
INSERT INTO sys_notice (notice_id, notice_title, notice_type, notice_content, status, created_by)
VALUES ('80000000-0000-0000-0000-000000000001', '系统上线通知', '1', '系统已成功上线，欢迎使用！', '0', 'admin');

-- =====================================================================
-- 脚本结束
-- =====================================================================

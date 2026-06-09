-- =====================================================================
-- 云枢中台 — PostgreSQL 核心数据库初始化脚本
-- 版本: 1.0
-- 描述: 创建系统核心表（用户、角色、菜单、部门、岗位、通知、
--       操作日志、登录日志、在线用户、定时任务、租户、字典、
--       参数配置、文件、OSS、短信、SSO、第三方、代码生成）
-- =====================================================================

-- =====================================================================
-- 1. 系统基础表
-- =====================================================================

-- ----------------------------
-- sys_user — 用户表
-- ----------------------------
DROP TABLE IF EXISTS "sys_user" CASCADE;
CREATE TABLE "sys_user" (
  "user_id"       BIGSERIAL      NOT NULL,
  "tenant_id"     BIGINT         DEFAULT 0,
  "dept_id"       BIGINT,
  "user_name"     VARCHAR(30)    NOT NULL,
  "nick_name"     VARCHAR(30)    NOT NULL,
  "user_type"     VARCHAR(10)    DEFAULT 'sys_user',
  "email"         VARCHAR(50)    DEFAULT '',
  "phonenumber"   VARCHAR(11)    DEFAULT '',
  "sex"           CHAR(1)        DEFAULT '0',
  "avatar"        VARCHAR(100)   DEFAULT '',
  "password"      VARCHAR(100)   DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "del_flag"      CHAR(1)        DEFAULT '0',
  "login_ip"      VARCHAR(128)   DEFAULT '',
  "login_date"    TIMESTAMP,
  "create_by"     VARCHAR(64)    DEFAULT '',
  "create_time"   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"     VARCHAR(64)    DEFAULT '',
  "update_time"   TIMESTAMP,
  "remark"        VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("user_id")
);
COMMENT ON TABLE "sys_user" IS '用户信息表';
COMMENT ON COLUMN "sys_user"."user_id" IS '用户ID';
COMMENT ON COLUMN "sys_user"."tenant_id" IS '租户ID';
COMMENT ON COLUMN "sys_user"."dept_id" IS '部门ID';
COMMENT ON COLUMN "sys_user"."user_name" IS '用户账号';
COMMENT ON COLUMN "sys_user"."nick_name" IS '用户昵称';
COMMENT ON COLUMN "sys_user"."user_type" IS '用户类型（00系统用户）';
COMMENT ON COLUMN "sys_user"."email" IS '用户邮箱';
COMMENT ON COLUMN "sys_user"."phonenumber" IS '手机号码';
COMMENT ON COLUMN "sys_user"."sex" IS '用户性别（0男 1女 2未知）';
COMMENT ON COLUMN "sys_user"."avatar" IS '头像地址';
COMMENT ON COLUMN "sys_user"."password" IS '密码';
COMMENT ON COLUMN "sys_user"."status" IS '帐号状态（0正常 1停用）';
COMMENT ON COLUMN "sys_user"."del_flag" IS '删除标志（0存在 2删除）';
COMMENT ON COLUMN "sys_user"."login_ip" IS '最后登录IP';
COMMENT ON COLUMN "sys_user"."login_date" IS '最后登录时间';
COMMENT ON COLUMN "sys_user"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_user"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_user"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_user"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_user"."remark" IS '备注';

CREATE INDEX "idx_sys_user_name" ON "sys_user"("user_name");
CREATE INDEX "idx_sys_user_tenant" ON "sys_user"("tenant_id");
CREATE INDEX "idx_sys_user_dept" ON "sys_user"("dept_id");

-- ----------------------------
-- sys_role — 角色表
-- ----------------------------
DROP TABLE IF EXISTS "sys_role" CASCADE;
CREATE TABLE "sys_role" (
  "role_id"            BIGSERIAL      NOT NULL,
  "role_name"          VARCHAR(30)    NOT NULL,
  "role_key"           VARCHAR(100)   NOT NULL,
  "role_sort"          INT            NOT NULL,
  "data_scope"         CHAR(1)        DEFAULT '1',
  "menu_check_strictly" BOOLEAN      DEFAULT true,
  "dept_check_strictly" BOOLEAN      DEFAULT true,
  "status"             CHAR(1)        DEFAULT '0',
  "del_flag"           CHAR(1)        DEFAULT '0',
  "create_by"          VARCHAR(64)    DEFAULT '',
  "create_time"        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"          VARCHAR(64)    DEFAULT '',
  "update_time"        TIMESTAMP,
  "remark"             VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("role_id")
);
COMMENT ON TABLE "sys_role" IS '角色信息表';
COMMENT ON COLUMN "sys_role"."role_id" IS '角色ID';
COMMENT ON COLUMN "sys_role"."role_name" IS '角色名称';
COMMENT ON COLUMN "sys_role"."role_key" IS '角色权限字符串';
COMMENT ON COLUMN "sys_role"."role_sort" IS '显示顺序';
COMMENT ON COLUMN "sys_role"."data_scope" IS '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）';
COMMENT ON COLUMN "sys_role"."menu_check_strictly" IS '菜单树选择项是否关联显示';
COMMENT ON COLUMN "sys_role"."dept_check_strictly" IS '部门树选择项是否关联显示';
COMMENT ON COLUMN "sys_role"."status" IS '角色状态（0正常 1停用）';
COMMENT ON COLUMN "sys_role"."del_flag" IS '删除标志（0存在 2删除）';
COMMENT ON COLUMN "sys_role"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_role"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_role"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_role"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_role"."remark" IS '备注';

CREATE INDEX "idx_sys_role_key" ON "sys_role"("role_key");

-- ----------------------------
-- sys_menu — 菜单权限表
-- ----------------------------
DROP TABLE IF EXISTS "sys_menu" CASCADE;
CREATE TABLE "sys_menu" (
  "menu_id"     BIGSERIAL      NOT NULL,
  "menu_name"   VARCHAR(50)    NOT NULL,
  "parent_id"   BIGINT         DEFAULT 0,
  "order_num"   INT            DEFAULT 0,
  "path"        VARCHAR(200)   DEFAULT '',
  "component"   VARCHAR(255)   DEFAULT NULL,
  "query"       VARCHAR(255)   DEFAULT NULL,
  "is_frame"    CHAR(1)        DEFAULT '1',
  "is_cache"    CHAR(1)        DEFAULT '0',
  "menu_type"   CHAR(1)        DEFAULT '',
  "visible"     CHAR(1)        DEFAULT '0',
  "status"      CHAR(1)        DEFAULT '0',
  "perms"       VARCHAR(100)   DEFAULT NULL,
  "icon"        VARCHAR(100)   DEFAULT '#',
  "create_by"   VARCHAR(64)    DEFAULT '',
  "create_time" TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"   VARCHAR(64)    DEFAULT '',
  "update_time" TIMESTAMP,
  "remark"      VARCHAR(500)   DEFAULT '',
  PRIMARY KEY ("menu_id")
);
COMMENT ON TABLE "sys_menu" IS '菜单权限表';
COMMENT ON COLUMN "sys_menu"."menu_id" IS '菜单ID';
COMMENT ON COLUMN "sys_menu"."menu_name" IS '菜单名称';
COMMENT ON COLUMN "sys_menu"."parent_id" IS '父菜单ID';
COMMENT ON COLUMN "sys_menu"."order_num" IS '显示顺序';
COMMENT ON COLUMN "sys_menu"."path" IS '路由地址';
COMMENT ON COLUMN "sys_menu"."component" IS '组件路径';
COMMENT ON COLUMN "sys_menu"."query" IS '路由参数';
COMMENT ON COLUMN "sys_menu"."is_frame" IS '是否为外链（0是 1否）';
COMMENT ON COLUMN "sys_menu"."is_cache" IS '是否缓存（0缓存 1不缓存）';
COMMENT ON COLUMN "sys_menu"."menu_type" IS '菜单类型（M目录 C菜单 F按钮）';
COMMENT ON COLUMN "sys_menu"."visible" IS '菜单状态（0显示 1隐藏）';
COMMENT ON COLUMN "sys_menu"."status" IS '菜单状态（0正常 1停用）';
COMMENT ON COLUMN "sys_menu"."perms" IS '权限标识';
COMMENT ON COLUMN "sys_menu"."icon" IS '菜单图标';
COMMENT ON COLUMN "sys_menu"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_menu"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_menu"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_menu"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_menu"."remark" IS '备注';

CREATE INDEX "idx_sys_menu_parent" ON "sys_menu"("parent_id");

-- ----------------------------
-- sys_dept — 部门表
-- ----------------------------
DROP TABLE IF EXISTS "sys_dept" CASCADE;
CREATE TABLE "sys_dept" (
  "dept_id"     BIGSERIAL      NOT NULL,
  "tenant_id"   BIGINT         DEFAULT 0,
  "parent_id"   BIGINT         DEFAULT 0,
  "ancestors"   VARCHAR(50)    DEFAULT '',
  "dept_name"   VARCHAR(30)    DEFAULT '',
  "order_num"   INT            DEFAULT 0,
  "leader"      VARCHAR(20)    DEFAULT NULL,
  "phone"       VARCHAR(11)    DEFAULT NULL,
  "email"       VARCHAR(50)    DEFAULT NULL,
  "status"      CHAR(1)        DEFAULT '0',
  "del_flag"    CHAR(1)        DEFAULT '0',
  "create_by"   VARCHAR(64)    DEFAULT '',
  "create_time" TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"   VARCHAR(64)    DEFAULT '',
  "update_time" TIMESTAMP,
  PRIMARY KEY ("dept_id")
);
COMMENT ON TABLE "sys_dept" IS '部门表';
COMMENT ON COLUMN "sys_dept"."dept_id" IS '部门id';
COMMENT ON COLUMN "sys_dept"."tenant_id" IS '租户id';
COMMENT ON COLUMN "sys_dept"."parent_id" IS '父部门id';
COMMENT ON COLUMN "sys_dept"."ancestors" IS '祖级列表';
COMMENT ON COLUMN "sys_dept"."dept_name" IS '部门名称';
COMMENT ON COLUMN "sys_dept"."order_num" IS '显示顺序';
COMMENT ON COLUMN "sys_dept"."leader" IS '负责人';
COMMENT ON COLUMN "sys_dept"."phone" IS '联系电话';
COMMENT ON COLUMN "sys_dept"."email" IS '邮箱';
COMMENT ON COLUMN "sys_dept"."status" IS '部门状态（0正常 1停用）';
COMMENT ON COLUMN "sys_dept"."del_flag" IS '删除标志（0存在 2删除）';
COMMENT ON COLUMN "sys_dept"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_dept"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_dept"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_dept"."update_time" IS '更新时间';

CREATE INDEX "idx_sys_dept_parent" ON "sys_dept"("parent_id");
CREATE INDEX "idx_sys_dept_tenant" ON "sys_dept"("tenant_id");

-- ----------------------------
-- sys_post — 岗位表
-- ----------------------------
DROP TABLE IF EXISTS "sys_post" CASCADE;
CREATE TABLE "sys_post" (
  "post_id"     BIGSERIAL      NOT NULL,
  "post_code"   VARCHAR(64)    NOT NULL,
  "post_name"   VARCHAR(50)    NOT NULL,
  "post_sort"   INT            NOT NULL,
  "status"      CHAR(1)        DEFAULT '0',
  "create_by"   VARCHAR(64)    DEFAULT '',
  "create_time" TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"   VARCHAR(64)    DEFAULT '',
  "update_time" TIMESTAMP,
  "remark"      VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("post_id")
);
COMMENT ON TABLE "sys_post" IS '岗位信息表';
COMMENT ON COLUMN "sys_post"."post_code" IS '岗位编码';
COMMENT ON COLUMN "sys_post"."post_name" IS '岗位名称';
COMMENT ON COLUMN "sys_post"."post_sort" IS '显示顺序';
COMMENT ON COLUMN "sys_post"."status" IS '状态（0正常 1停用）';
COMMENT ON COLUMN "sys_post"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_post"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_post"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_post"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_post"."remark" IS '备注';

-- =====================================================================
-- 2. 关联表
-- =====================================================================

-- ----------------------------
-- sys_user_role — 用户角色关联
-- ----------------------------
DROP TABLE IF EXISTS "sys_user_role" CASCADE;
CREATE TABLE "sys_user_role" (
  "user_id" BIGINT NOT NULL,
  "role_id" BIGINT NOT NULL,
  PRIMARY KEY ("user_id", "role_id")
);
COMMENT ON TABLE "sys_user_role" IS '用户和角色关联表';

-- ----------------------------
-- sys_role_menu — 角色菜单关联
-- ----------------------------
DROP TABLE IF EXISTS "sys_role_menu" CASCADE;
CREATE TABLE "sys_role_menu" (
  "role_id" BIGINT NOT NULL,
  "menu_id" BIGINT NOT NULL,
  PRIMARY KEY ("role_id", "menu_id")
);
COMMENT ON TABLE "sys_role_menu" IS '角色和菜单关联表';

-- ----------------------------
-- sys_role_dept — 角色部门关联（数据权限）
-- ----------------------------
DROP TABLE IF EXISTS "sys_role_dept" CASCADE;
CREATE TABLE "sys_role_dept" (
  "role_id" BIGINT NOT NULL,
  "dept_id" BIGINT NOT NULL,
  PRIMARY KEY ("role_id", "dept_id")
);
COMMENT ON TABLE "sys_role_dept" IS '角色和部门关联表';

-- ----------------------------
-- sys_user_post — 用户岗位关联
-- ----------------------------
DROP TABLE IF EXISTS "sys_user_post" CASCADE;
CREATE TABLE "sys_user_post" (
  "user_id" BIGINT NOT NULL,
  "post_id" BIGINT NOT NULL,
  PRIMARY KEY ("user_id", "post_id")
);
COMMENT ON TABLE "sys_user_post" IS '用户与岗位关联表';

-- =====================================================================
-- 3. 通知消息
-- =====================================================================

-- ----------------------------
-- sys_notice — 通知公告表
-- ----------------------------
DROP TABLE IF EXISTS "sys_notice" CASCADE;
CREATE TABLE "sys_notice" (
  "notice_id"    BIGSERIAL      NOT NULL,
  "notice_title" VARCHAR(50)    NOT NULL,
  "notice_type"  CHAR(1)        NOT NULL,
  "notice_content" TEXT,
  "status"       CHAR(1)        DEFAULT '0',
  "create_by"    VARCHAR(64)    DEFAULT '',
  "create_time"  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"    VARCHAR(64)    DEFAULT '',
  "update_time"  TIMESTAMP,
  "remark"       VARCHAR(255)   DEFAULT NULL,
  PRIMARY KEY ("notice_id")
);
COMMENT ON TABLE "sys_notice" IS '通知公告表';
COMMENT ON COLUMN "sys_notice"."notice_id" IS '公告ID';
COMMENT ON COLUMN "sys_notice"."notice_title" IS '公告标题';
COMMENT ON COLUMN "sys_notice"."notice_type" IS '公告类型（1通知 2公告）';
COMMENT ON COLUMN "sys_notice"."notice_content" IS '公告内容';
COMMENT ON COLUMN "sys_notice"."status" IS '公告状态（0正常 1关闭）';
COMMENT ON COLUMN "sys_notice"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_notice"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_notice"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_notice"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_notice"."remark" IS '备注';

-- =====================================================================
-- 4. 操作日志 & 登录日志
-- =====================================================================

-- ----------------------------
-- sys_oper_log — 操作日志表
-- ----------------------------
DROP TABLE IF EXISTS "sys_oper_log" CASCADE;
CREATE TABLE "sys_oper_log" (
  "oper_id"        BIGSERIAL      NOT NULL,
  "title"          VARCHAR(50)    DEFAULT '',
  "business_type"  INT            DEFAULT 0,
  "method"         VARCHAR(100)   DEFAULT '',
  "request_method" VARCHAR(10)    DEFAULT '',
  "operator_type"  INT            DEFAULT 0,
  "oper_name"      VARCHAR(50)    DEFAULT '',
  "dept_name"      VARCHAR(50)    DEFAULT '',
  "oper_url"       VARCHAR(255)   DEFAULT '',
  "oper_ip"        VARCHAR(128)   DEFAULT '',
  "oper_location"  VARCHAR(255)   DEFAULT '',
  "oper_param"     TEXT,
  "json_result"    TEXT,
  "status"         INT            DEFAULT 0,
  "error_msg"      VARCHAR(2000)  DEFAULT '',
  "oper_time"      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "cost_time"      BIGINT         DEFAULT 0,
  PRIMARY KEY ("oper_id")
);
COMMENT ON TABLE "sys_oper_log" IS '操作日志记录';
COMMENT ON COLUMN "sys_oper_log"."oper_id" IS '日志主键';
COMMENT ON COLUMN "sys_oper_log"."title" IS '模块标题';
COMMENT ON COLUMN "sys_oper_log"."business_type" IS '业务类型（0其它 1新增 2修改 3删除）';
COMMENT ON COLUMN "sys_oper_log"."method" IS '方法名称';
COMMENT ON COLUMN "sys_oper_log"."request_method" IS '请求方式';
COMMENT ON COLUMN "sys_oper_log"."operator_type" IS '操作类别（0其它 1后台用户 2手机端用户）';
COMMENT ON COLUMN "sys_oper_log"."oper_name" IS '操作人员';
COMMENT ON COLUMN "sys_oper_log"."dept_name" IS '部门名称';
COMMENT ON COLUMN "sys_oper_log"."oper_url" IS '请求URL';
COMMENT ON COLUMN "sys_oper_log"."oper_ip" IS '主机地址';
COMMENT ON COLUMN "sys_oper_log"."oper_location" IS '操作地点';
COMMENT ON COLUMN "sys_oper_log"."oper_param" IS '请求参数';
COMMENT ON COLUMN "sys_oper_log"."json_result" IS '返回参数';
COMMENT ON COLUMN "sys_oper_log"."status" IS '操作状态（0正常 1异常）';
COMMENT ON COLUMN "sys_oper_log"."error_msg" IS '错误消息';
COMMENT ON COLUMN "sys_oper_log"."oper_time" IS '操作时间';
COMMENT ON COLUMN "sys_oper_log"."cost_time" IS '消耗时间';

CREATE INDEX "idx_sys_oper_log_time" ON "sys_oper_log"("oper_time");
CREATE INDEX "idx_sys_oper_log_type" ON "sys_oper_log"("business_type");

-- ----------------------------
-- sys_login_info — 登录日志表
-- ----------------------------
DROP TABLE IF EXISTS "sys_login_info" CASCADE;
CREATE TABLE "sys_login_info" (
  "info_id"       BIGSERIAL      NOT NULL,
  "tenant_id"     BIGINT         DEFAULT 0,
  "user_name"     VARCHAR(50)    DEFAULT '',
  "ipaddr"        VARCHAR(128)   DEFAULT '',
  "login_location" VARCHAR(255)  DEFAULT '',
  "browser"       VARCHAR(50)    DEFAULT '',
  "os"            VARCHAR(50)    DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "msg"           VARCHAR(255)   DEFAULT '',
  "login_time"    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("info_id")
);
COMMENT ON TABLE "sys_login_info" IS '系统访问记录';
COMMENT ON COLUMN "sys_login_info"."info_id" IS '访问ID';
COMMENT ON COLUMN "sys_login_info"."tenant_id" IS '租户ID';
COMMENT ON COLUMN "sys_login_info"."user_name" IS '用户账号';
COMMENT ON COLUMN "sys_login_info"."ipaddr" IS '登录IP地址';
COMMENT ON COLUMN "sys_login_info"."login_location" IS '登录地点';
COMMENT ON COLUMN "sys_login_info"."browser" IS '浏览器类型';
COMMENT ON COLUMN "sys_login_info"."os" IS '操作系统';
COMMENT ON COLUMN "sys_login_info"."status" IS '登录状态（0成功 1失败）';
COMMENT ON COLUMN "sys_login_info"."msg" IS '提示消息';
COMMENT ON COLUMN "sys_login_info"."login_time" IS '访问时间';

CREATE INDEX "idx_sys_login_info_time" ON "sys_login_info"("login_time");
CREATE INDEX "idx_sys_login_info_user" ON "sys_login_info"("user_name");

-- ----------------------------
-- sys_user_online — 在线用户表
-- ----------------------------
DROP TABLE IF EXISTS "sys_user_online" CASCADE;
CREATE TABLE "sys_user_online" (
  "session_id"    VARCHAR(50)   NOT NULL,
  "tenant_id"     BIGINT         DEFAULT 0,
  "login_name"    VARCHAR(50)   DEFAULT '',
  "dept_name"     VARCHAR(50)   DEFAULT '',
  "ipaddr"        VARCHAR(128)   DEFAULT '',
  "login_location" VARCHAR(255)  DEFAULT '',
  "browser"       VARCHAR(50)    DEFAULT '',
  "os"            VARCHAR(50)    DEFAULT '',
  "status"        CHAR(1)        DEFAULT 'on_line',
  "start_timestamp" TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  "last_access_time" TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  "expire_time"   INT            DEFAULT 0,
  PRIMARY KEY ("session_id")
);
COMMENT ON TABLE "sys_user_online" IS '在线用户记录';
COMMENT ON COLUMN "sys_user_online"."session_id" IS '会话编号';
COMMENT ON COLUMN "sys_user_online"."tenant_id" IS '租户ID';
COMMENT ON COLUMN "sys_user_online"."login_name" IS '登录名称';
COMMENT ON COLUMN "sys_user_online"."dept_name" IS '部门名称';
COMMENT ON COLUMN "sys_user_online"."ipaddr" IS '主机';
COMMENT ON COLUMN "sys_user_online"."login_location" IS '登录地点';
COMMENT ON COLUMN "sys_user_online"."browser" IS '浏览器类型';
COMMENT ON COLUMN "sys_user_online"."os" IS '操作系统';
COMMENT ON COLUMN "sys_user_online"."status" IS '在线状态on_line在线off_line离线';
COMMENT ON COLUMN "sys_user_online"."start_timestamp" IS 'session创建时间';
COMMENT ON COLUMN "sys_user_online"."last_access_time" IS 'session最后访问时间';
COMMENT ON COLUMN "sys_user_online"."expire_time" IS '超时时间，单位为分钟';

CREATE INDEX "idx_user_online_login" ON "sys_user_online"("login_name");
CREATE INDEX "idx_user_online_last" ON "sys_user_online"("last_access_time");

-- =====================================================================
-- 5. 定时任务
-- =====================================================================

-- ----------------------------
-- sys_job — 定时任务调度表
-- ----------------------------
DROP TABLE IF EXISTS "sys_job" CASCADE;
CREATE TABLE "sys_job" (
  "job_id"          BIGSERIAL      NOT NULL,
  "job_name"        VARCHAR(64)    DEFAULT '',
  "job_group"       VARCHAR(64)    DEFAULT 'DEFAULT',
  "invoke_target"   VARCHAR(500)   NOT NULL,
  "cron_expression" VARCHAR(255)   DEFAULT '',
  "misfire_policy"  VARCHAR(20)    DEFAULT '3',
  "concurrent"      CHAR(1)        DEFAULT '1',
  "status"          CHAR(1)        DEFAULT '0',
  "create_by"       VARCHAR(64)    DEFAULT '',
  "create_time"     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"       VARCHAR(64)    DEFAULT '',
  "update_time"     TIMESTAMP,
  "remark"          VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("job_id", "job_name", "job_group")
);
COMMENT ON TABLE "sys_job" IS '定时任务调度表';
COMMENT ON COLUMN "sys_job"."job_id" IS '任务ID';
COMMENT ON COLUMN "sys_job"."job_name" IS '任务名称';
COMMENT ON COLUMN "sys_job"."job_group" IS '任务组名';
COMMENT ON COLUMN "sys_job"."invoke_target" IS '调用目标字符串';
COMMENT ON COLUMN "sys_job"."cron_expression" IS 'cron执行表达式';
COMMENT ON COLUMN "sys_job"."misfire_policy" IS '计划执行错误策略（1立即执行 2执行一次 3放弃执行）';
COMMENT ON COLUMN "sys_job"."concurrent" IS '是否并发执行（0允许 1禁止）';
COMMENT ON COLUMN "sys_job"."status" IS '状态（0正常 1暂停）';
COMMENT ON COLUMN "sys_job"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_job"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_job"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_job"."update_time" IS '更新时间';
COMMENT ON COLUMN "sys_job"."remark" IS '备注信息';

-- ----------------------------
-- sys_job_log — 定时任务调度日志表
-- ----------------------------
DROP TABLE IF EXISTS "sys_job_log" CASCADE;
CREATE TABLE "sys_job_log" (
  "job_log_id"  BIGSERIAL      NOT NULL,
  "job_name"    VARCHAR(64)    NOT NULL,
  "job_group"   VARCHAR(64)    NOT NULL,
  "invoke_target" VARCHAR(500) NOT NULL,
  "job_message" VARCHAR(500)   DEFAULT NULL,
  "status"      CHAR(1)        DEFAULT '0',
  "exception_info" VARCHAR(2000) DEFAULT '',
  "create_time" TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("job_log_id")
);
COMMENT ON TABLE "sys_job_log" IS '定时任务调度日志表';
COMMENT ON COLUMN "sys_job_log"."job_log_id" IS '任务日志ID';
COMMENT ON COLUMN "sys_job_log"."job_name" IS '任务名称';
COMMENT ON COLUMN "sys_job_log"."job_group" IS '任务组名';
COMMENT ON COLUMN "sys_job_log"."invoke_target" IS '调用目标字符串';
COMMENT ON COLUMN "sys_job_log"."job_message" IS '日志信息';
COMMENT ON COLUMN "sys_job_log"."status" IS '执行状态（0正常 1失败）';
COMMENT ON COLUMN "sys_job_log"."exception_info" IS '异常信息';
COMMENT ON COLUMN "sys_job_log"."create_time" IS '创建时间';

CREATE INDEX "idx_sys_job_log_time" ON "sys_job_log"("create_time");

-- =====================================================================
-- 6. 租户系统
-- =====================================================================

-- ----------------------------
-- sys_tenant — 租户表
-- ----------------------------
DROP TABLE IF EXISTS "sys_tenant" CASCADE;
CREATE TABLE "sys_tenant" (
  "tenant_id"    BIGSERIAL      NOT NULL,
  "tenant_name"  VARCHAR(30)    NOT NULL,
  "company_id"   VARCHAR(30)    DEFAULT '',
  "company_name" VARCHAR(100)   DEFAULT '',
  "license_number" VARCHAR(30)  DEFAULT '',
  "address"      VARCHAR(200)   DEFAULT '',
  "domain"       VARCHAR(100)   DEFAULT '',
  "intro"        TEXT,
  "remark"       TEXT,
  "package_id"   BIGINT,
  "expire_time"  TIMESTAMP,
  "account_count" INT           DEFAULT -1,
  "status"       CHAR(1)        DEFAULT '0',
  "del_flag"     CHAR(1)        DEFAULT '0',
  "create_by"    VARCHAR(64)    DEFAULT '',
  "create_time"  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"    VARCHAR(64)    DEFAULT '',
  "update_time"  TIMESTAMP,
  PRIMARY KEY ("tenant_id")
);
COMMENT ON TABLE "sys_tenant" IS '租户表';
COMMENT ON COLUMN "sys_tenant"."tenant_id" IS '租户ID';
COMMENT ON COLUMN "sys_tenant"."tenant_name" IS '租户名称';
COMMENT ON COLUMN "sys_tenant"."company_id" IS '公司编号';
COMMENT ON COLUMN "sys_tenant"."company_name" IS '公司名称';
COMMENT ON COLUMN "sys_tenant"."license_number" IS '统一社会信用代码';
COMMENT ON COLUMN "sys_tenant"."address" IS '公司地址';
COMMENT ON COLUMN "sys_tenant"."domain" IS '域名';
COMMENT ON COLUMN "sys_tenant"."intro" IS '企业简介';
COMMENT ON COLUMN "sys_tenant"."remark" IS '备注';
COMMENT ON COLUMN "sys_tenant"."package_id" IS '租户套餐ID';
COMMENT ON COLUMN "sys_tenant"."expire_time" IS '过期时间';
COMMENT ON COLUMN "sys_tenant"."account_count" IS '账号数量';
COMMENT ON COLUMN "sys_tenant"."status" IS '状态（0正常 1停用）';
COMMENT ON COLUMN "sys_tenant"."del_flag" IS '删除标志（0存在 2删除）';
COMMENT ON COLUMN "sys_tenant"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_tenant"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_tenant"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_tenant"."update_time" IS '更新时间';

CREATE INDEX "idx_sys_tenant_name" ON "sys_tenant"("tenant_name");

-- ----------------------------
-- sys_tenant_package — 租户套餐表
-- ----------------------------
DROP TABLE IF EXISTS "sys_tenant_package" CASCADE;
CREATE TABLE "sys_tenant_package" (
  "package_id"    BIGSERIAL      NOT NULL,
  "package_name"  VARCHAR(30)    NOT NULL,
  "menu_ids"      VARCHAR(3000)  NOT NULL,
  "remark"        VARCHAR(500)   DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "del_flag"      CHAR(1)        DEFAULT '0',
  "create_by"     VARCHAR(64)    DEFAULT '',
  "create_time"   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"     VARCHAR(64)    DEFAULT '',
  "update_time"   TIMESTAMP,
  PRIMARY KEY ("package_id")
);
COMMENT ON TABLE "sys_tenant_package" IS '租户套餐表';
COMMENT ON COLUMN "sys_tenant_package"."package_id" IS '租户套餐ID';
COMMENT ON COLUMN "sys_tenant_package"."package_name" IS '套餐名称';
COMMENT ON COLUMN "sys_tenant_package"."menu_ids" IS '关联菜单ID';
COMMENT ON COLUMN "sys_tenant_package"."remark" IS '备注';
COMMENT ON COLUMN "sys_tenant_package"."status" IS '状态（0正常 1停用）';
COMMENT ON COLUMN "sys_tenant_package"."del_flag" IS '删除标志（0存在 2删除）';
COMMENT ON COLUMN "sys_tenant_package"."create_by" IS '创建者';
COMMENT ON COLUMN "sys_tenant_package"."create_time" IS '创建时间';
COMMENT ON COLUMN "sys_tenant_package"."update_by" IS '更新者';
COMMENT ON COLUMN "sys_tenant_package"."update_time" IS '更新时间';

-- =====================================================================
-- 7. 字典 & 参数配置
-- =====================================================================

-- ----------------------------
-- sys_dict_type — 字典类型表
-- ----------------------------
DROP TABLE IF EXISTS "sys_dict_type" CASCADE;
CREATE TABLE "sys_dict_type" (
  "dict_id"     BIGSERIAL      NOT NULL,
  "dict_name"   VARCHAR(100)   DEFAULT '',
  "dict_type"   VARCHAR(100)   DEFAULT '',
  "status"      CHAR(1)        DEFAULT '0',
  "create_by"   VARCHAR(64)    DEFAULT '',
  "create_time" TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"   VARCHAR(64)    DEFAULT '',
  "update_time" TIMESTAMP,
  "remark"      VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("dict_id")
);
COMMENT ON TABLE "sys_dict_type" IS '字典类型表';

CREATE UNIQUE INDEX "idx_sys_dict_type" ON "sys_dict_type"("dict_type");

-- ----------------------------
-- sys_dict_data — 字典数据表
-- ----------------------------
DROP TABLE IF EXISTS "sys_dict_data" CASCADE;
CREATE TABLE "sys_dict_data" (
  "dict_code"   BIGSERIAL      NOT NULL,
  "dict_sort"   INT            DEFAULT 0,
  "dict_label"  VARCHAR(100)   DEFAULT '',
  "dict_value"  VARCHAR(100)   DEFAULT '',
  "dict_type"   VARCHAR(100)   DEFAULT '',
  "css_class"   VARCHAR(100)   DEFAULT NULL,
  "list_class"  VARCHAR(100)   DEFAULT NULL,
  "is_default"  CHAR(1)        DEFAULT 'N',
  "status"      CHAR(1)        DEFAULT '0',
  "create_by"   VARCHAR(64)    DEFAULT '',
  "create_time" TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"   VARCHAR(64)    DEFAULT '',
  "update_time" TIMESTAMP,
  "remark"      VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("dict_code")
);
COMMENT ON TABLE "sys_dict_data" IS '字典数据表';

CREATE INDEX "idx_sys_dict_data_type" ON "sys_dict_data"("dict_type");

-- ----------------------------
-- sys_config — 参数配置表
-- ----------------------------
DROP TABLE IF EXISTS "sys_config" CASCADE;
CREATE TABLE "sys_config" (
  "config_id"    BIGSERIAL      NOT NULL,
  "config_name"  VARCHAR(100)   DEFAULT '',
  "config_key"   VARCHAR(100)   DEFAULT '',
  "config_value" VARCHAR(500)   DEFAULT '',
  "config_type"  CHAR(1)        DEFAULT 'N',
  "create_by"    VARCHAR(64)    DEFAULT '',
  "create_time"  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"    VARCHAR(64)    DEFAULT '',
  "update_time"  TIMESTAMP,
  "remark"       VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("config_id")
);
COMMENT ON TABLE "sys_config" IS '参数配置表';

CREATE UNIQUE INDEX "idx_sys_config_key" ON "sys_config"("config_key");

-- =====================================================================
-- 8. 文件 / OSS / 短信 / SSO / 第三方
-- =====================================================================

-- ----------------------------
-- sys_file_info — 文件信息表
-- ----------------------------
DROP TABLE IF EXISTS "sys_file_info" CASCADE;
CREATE TABLE "sys_file_info" (
  "file_id"         BIGSERIAL       NOT NULL,
  "file_name"       VARCHAR(255)    NOT NULL,
  "file_path"       VARCHAR(500)    DEFAULT '',
  "file_size"       VARCHAR(100)    DEFAULT '',
  "file_type"       VARCHAR(20)     DEFAULT '',
  "content_type"    VARCHAR(100)    DEFAULT '',
  "original_name"   VARCHAR(255)    DEFAULT '',
  "create_by"       VARCHAR(64)    DEFAULT '',
  "create_time"     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  "update_by"       VARCHAR(64)    DEFAULT '',
  "update_time"     TIMESTAMP,
  "remark"          VARCHAR(500)    DEFAULT NULL,
  PRIMARY KEY ("file_id")
);
COMMENT ON TABLE "sys_file_info" IS '文件信息表';

-- ----------------------------
-- sys_oss_config — OSS 配置表
-- ----------------------------
DROP TABLE IF EXISTS "sys_oss_config" CASCADE;
CREATE TABLE "sys_oss_config" (
  "oss_config_id" BIGSERIAL      NOT NULL,
  "config_key"    VARCHAR(20)    DEFAULT '',
  "access_key"    VARCHAR(255)   DEFAULT '',
  "secret_key"    VARCHAR(255)   DEFAULT '',
  "bucket_name"   VARCHAR(255)   DEFAULT '',
  "prefix"        VARCHAR(255)   DEFAULT '',
  "endpoint"      VARCHAR(255)   DEFAULT '',
  "domain"        VARCHAR(255)   DEFAULT '',
  "is_https"      CHAR(1)        DEFAULT 'N',
  "region"        VARCHAR(255)   DEFAULT '',
  "access_policy" CHAR(1)        DEFAULT '1',
  "status"        CHAR(1)        DEFAULT '0',
  "ext1"          VARCHAR(255)   DEFAULT '',
  "create_by"     VARCHAR(64)    DEFAULT '',
  "create_time"   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"     VARCHAR(64)    DEFAULT '',
  "update_time"   TIMESTAMP,
  "remark"        VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("oss_config_id")
);
COMMENT ON TABLE "sys_oss_config" IS '对象存储配置表';

CREATE UNIQUE INDEX "idx_sys_oss_config_key" ON "sys_oss_config"("config_key");

-- ----------------------------
-- sys_sms_config — 短信配置表
-- ----------------------------
DROP TABLE IF EXISTS "sys_sms_config" CASCADE;
CREATE TABLE "sys_sms_config" (
  "sms_config_id" BIGSERIAL      NOT NULL,
  "config_key"    VARCHAR(20)    DEFAULT '',
  "provider"      VARCHAR(50)    DEFAULT '',
  "access_key"    VARCHAR(255)   DEFAULT '',
  "secret_key"    VARCHAR(255)   DEFAULT '',
  "region"        VARCHAR(100)   DEFAULT '',
  "sign_name"     VARCHAR(100)   DEFAULT '',
  "template_code" VARCHAR(100)   DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "create_by"     VARCHAR(64)    DEFAULT '',
  "create_time"   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"     VARCHAR(64)    DEFAULT '',
  "update_time"   TIMESTAMP,
  "remark"        VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("sms_config_id")
);
COMMENT ON TABLE "sys_sms_config" IS '短信配置表';

CREATE UNIQUE INDEX "idx_sys_sms_config_key" ON "sys_sms_config"("config_key");

-- ----------------------------
-- sys_sms_log — 短信发送日志
-- ----------------------------
DROP TABLE IF EXISTS "sys_sms_log" CASCADE;
CREATE TABLE "sys_sms_log" (
  "sms_log_id"    BIGSERIAL      NOT NULL,
  "phone"         VARCHAR(20)    NOT NULL,
  "content"       VARCHAR(500)   DEFAULT '',
  "template_code" VARCHAR(100)   DEFAULT '',
  "provider"      VARCHAR(50)    DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "send_time"     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "error_msg"     VARCHAR(500)   DEFAULT '',
  PRIMARY KEY ("sms_log_id")
);
COMMENT ON TABLE "sys_sms_log" IS '短信发送日志';

CREATE INDEX "idx_sys_sms_log_time" ON "sys_sms_log"("send_time");

-- ----------------------------
-- sys_sso_config — SSO 单点登录配置
-- ----------------------------
DROP TABLE IF EXISTS "sys_sso_config" CASCADE;
CREATE TABLE "sys_sso_config" (
  "sso_config_id" BIGSERIAL      NOT NULL,
  "config_key"    VARCHAR(20)    DEFAULT '',
  "provider"      VARCHAR(50)    DEFAULT '',
  "client_id"     VARCHAR(255)   DEFAULT '',
  "client_secret" VARCHAR(255)   DEFAULT '',
  "auth_uri"      VARCHAR(500)   DEFAULT '',
  "token_uri"     VARCHAR(500)   DEFAULT '',
  "user_info_uri" VARCHAR(500)   DEFAULT '',
  "redirect_uri"  VARCHAR(500)   DEFAULT '',
  "scope"         VARCHAR(200)   DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "create_by"     VARCHAR(64)    DEFAULT '',
  "create_time"   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"     VARCHAR(64)    DEFAULT '',
  "update_time"   TIMESTAMP,
  "remark"        VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("sso_config_id")
);
COMMENT ON TABLE "sys_sso_config" IS 'SSO 单点登录配置表';

-- ----------------------------
-- sys_third_config — 第三方登录配置
-- ----------------------------
DROP TABLE IF EXISTS "sys_third_config" CASCADE;
CREATE TABLE "sys_third_config" (
  "third_config_id" BIGSERIAL     NOT NULL,
  "config_key"    VARCHAR(20)    DEFAULT '',
  "platform"      VARCHAR(50)    DEFAULT '',
  "app_id"        VARCHAR(255)   DEFAULT '',
  "app_secret"    VARCHAR(255)   DEFAULT '',
  "callback_url"  VARCHAR(500)   DEFAULT '',
  "status"        CHAR(1)        DEFAULT '0',
  "create_by"     VARCHAR(64)    DEFAULT '',
  "create_time"   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"     VARCHAR(64)    DEFAULT '',
  "update_time"   TIMESTAMP,
  "remark"        VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("third_config_id")
);
COMMENT ON TABLE "sys_third_config" IS '第三方登录配置表';

-- =====================================================================
-- 9. 代码生成
-- =====================================================================

-- ----------------------------
-- gen_table — 代码生成业务表
-- ----------------------------
DROP TABLE IF EXISTS "gen_table" CASCADE;
CREATE TABLE "gen_table" (
  "table_id"     BIGSERIAL      NOT NULL,
  "table_name"   VARCHAR(200)   DEFAULT '',
  "table_comment" VARCHAR(500)  DEFAULT '',
  "sub_table_name" VARCHAR(64)  DEFAULT '',
  "sub_table_fk_name" VARCHAR(64) DEFAULT '',
  "class_name"   VARCHAR(100)   DEFAULT '',
  "tpl_category" VARCHAR(200)   DEFAULT 'crud',
  "package_name" VARCHAR(100)   DEFAULT '',
  "module_name"  VARCHAR(30)    DEFAULT '',
  "business_name" VARCHAR(30)   DEFAULT '',
  "function_name" VARCHAR(50)   DEFAULT '',
  "function_author" VARCHAR(50)  DEFAULT '',
  "gen_type"     CHAR(1)        DEFAULT '0',
  "gen_path"     VARCHAR(200)   DEFAULT '/',
  "options"      VARCHAR(1000)  DEFAULT NULL,
  "create_by"    VARCHAR(64)    DEFAULT '',
  "create_time"  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"    VARCHAR(64)    DEFAULT '',
  "update_time"  TIMESTAMP,
  "remark"       VARCHAR(500)   DEFAULT NULL,
  PRIMARY KEY ("table_id")
);
COMMENT ON TABLE "gen_table" IS '代码生成业务表';

-- ----------------------------
-- gen_table_column — 代码生成业务表字段
-- ----------------------------
DROP TABLE IF EXISTS "gen_table_column" CASCADE;
CREATE TABLE "gen_table_column" (
  "column_id"    BIGSERIAL      NOT NULL,
  "table_id"     BIGINT,
  "column_name"  VARCHAR(200)   DEFAULT '',
  "column_comment" VARCHAR(500) DEFAULT '',
  "column_type"  VARCHAR(100)   DEFAULT '',
  "java_type"    VARCHAR(500)   DEFAULT '',
  "java_field"   VARCHAR(200)   DEFAULT '',
  "is_pk"        CHAR(1)        DEFAULT '',
  "is_increment" CHAR(1)        DEFAULT '',
  "is_required"  CHAR(1)        DEFAULT '',
  "is_insert"    CHAR(1)        DEFAULT '',
  "is_edit"      CHAR(1)        DEFAULT '',
  "is_list"      CHAR(1)        DEFAULT '',
  "is_query"     CHAR(1)        DEFAULT '',
  "query_type"   VARCHAR(200)   DEFAULT 'EQ',
  "html_type"    VARCHAR(200)   DEFAULT '',
  "dict_type"    VARCHAR(200)   DEFAULT '',
  "sort"         INT            DEFAULT 0,
  "create_by"    VARCHAR(64)    DEFAULT '',
  "create_time"  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  "update_by"    VARCHAR(64)    DEFAULT '',
  "update_time"  TIMESTAMP,
  PRIMARY KEY ("column_id")
);
COMMENT ON TABLE "gen_table_column" IS '代码生成业务表字段';

CREATE INDEX "idx_gen_table_column_table" ON "gen_table_column"("table_id");

-- =====================================================================
-- 10. 初始化数据
-- =====================================================================

-- ----------------------------
-- 管理员用户（密码: admin123，实际项目中应使用 bcrypt/argon2 等哈希）
-- ----------------------------
INSERT INTO "sys_user" ("user_id", "dept_id", "user_name", "nick_name", "email", "phonenumber", "sex", "password", "status") VALUES
(1, 103, 'admin', '云枢中台', 'yunshu@example.com', '15800000000', '1', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0');

-- ----------------------------
-- 角色数据
-- ----------------------------
INSERT INTO "sys_role" VALUES
(1, '超级管理员', 'admin', 1, '1', true, true, '0', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '超级管理员'),
(2, '普通角色', 'common', 2, '2', true, true, '0', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '普通角色');

-- ----------------------------
-- 部门数据
-- ----------------------------
INSERT INTO "sys_dept" VALUES
(100, 0, 0, '0', '云枢中台', 0, '云枢', '15800000000', 'yunshu@example.com', '0', '0', 'admin', CURRENT_TIMESTAMP, '', NULL),
(101, 0, 100, '0,100', '研发部', 1, '张三', '15800000001', 'dev@example.com', '0', '0', 'admin', CURRENT_TIMESTAMP, '', NULL),
(102, 0, 100, '0,100', '市场部', 2, '李四', '15800000002', 'marketing@example.com', '0', '0', 'admin', CURRENT_TIMESTAMP, '', NULL),
(103, 0, 100, '0,100', '测试部', 3, '王五', '15800000003', 'qa@example.com', '0', '0', 'admin', CURRENT_TIMESTAMP, '', NULL);

-- ----------------------------
-- 岗位数据
-- ----------------------------
INSERT INTO "sys_post" VALUES
(1, 'ceo', '董事长', 1, '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2, 'se', '项目经理', 2, '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(3, 'hr', '人力资源', 3, '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(4, 'user', '普通员工', 4, '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- ----------------------------
-- 用户角色 / 岗位关联
-- ----------------------------
INSERT INTO "sys_user_role" VALUES (1, 1);
INSERT INTO "sys_user_post" VALUES (1, 1);

-- ----------------------------
-- 菜单数据
-- ----------------------------
INSERT INTO "sys_menu" VALUES
(1, '系统管理', 0, 1, 'system', NULL, '', '1', '0', 'M', '0', '0', '', 'system', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2, '系统监控', 0, 2, 'monitor', NULL, '', '1', '0', 'M', '0', '0', '', 'monitor', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(3, '系统工具', 0, 3, 'tool', NULL, '', '1', '0', 'M', '0', '0', '', 'tool', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(100, '用户管理', 1, 1, 'user', 'system/user/index', '', '1', '0', 'C', '0', '0', 'system:user:list', 'user', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(101, '角色管理', 1, 2, 'role', 'system/role/index', '', '1', '0', 'C', '0', '0', 'system:role:list', 'peoples', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(102, '菜单管理', 1, 3, 'menu', 'system/menu/index', '', '1', '0', 'C', '0', '0', 'system:menu:list', 'tree-table', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(103, '部门管理', 1, 4, 'dept', 'system/dept/index', '', '1', '0', 'C', '0', '0', 'system:dept:list', 'tree', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(104, '岗位管理', 1, 5, 'post', 'system/post/index', '', '1', '0', 'C', '0', '0', 'system:post:list', 'post', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(105, '字典管理', 1, 6, 'dict', 'system/dict/index', '', '1', '0', 'C', '0', '0', 'system:dict:list', 'dict', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(106, '参数设置', 1, 7, 'config', 'system/config/index', '', '1', '0', 'C', '0', '0', 'system:config:list', 'edit', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(107, '通知公告', 1, 8, 'notice', 'system/notice/index', '', '1', '0', 'C', '0', '0', 'system:notice:list', 'message', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(200, '在线用户', 2, 1, 'online', 'monitor/online/index', '', '1', '0', 'C', '0', '0', 'monitor:online:list', 'online', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(201, '定时任务', 2, 2, 'job', 'monitor/job/index', '', '1', '0', 'C', '0', '0', 'monitor:job:list', 'job', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(202, '数据监控', 2, 3, 'druid', 'monitor/druid/index', '', '1', '0', 'C', '0', '0', 'monitor:druid:list', 'druid', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(203, '服务监控', 2, 4, 'server', 'monitor/server/index', '', '1', '0', 'C', '0', '0', 'monitor:server:list', 'server', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(204, '缓存监控', 2, 5, 'cache', 'monitor/cache/index', '', '1', '0', 'C', '0', '0', 'monitor:cache:list', 'redis', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(300, '表单构建', 3, 1, 'build', 'tool/build/index', '', '1', '0', 'C', '0', '0', 'tool:build:list', 'build', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(301, '代码生成', 3, 2, 'gen', 'tool/gen/index', '', '1', '0', 'C', '0', '0', 'tool:gen:list', 'code', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(302, '系统接口', 3, 3, 'swagger', 'tool/swagger/index', '', '1', '0', 'C', '0', '0', 'tool:swagger:list', 'swagger', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

-- ----------------------------
-- 角色菜单关联（超级管理员拥有全部菜单）
-- ----------------------------
INSERT INTO "sys_role_menu"
SELECT 1, "menu_id" FROM "sys_menu";

-- ----------------------------
-- 字典数据
-- ----------------------------
INSERT INTO "sys_dict_type" VALUES
(1, '用户性别', 'sys_user_sex', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(2, '菜单状态', 'sys_show_hide', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(3, '系统开关', 'sys_normal_disable', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(4, '任务状态', 'sys_job_status', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(5, '任务分组', 'sys_job_group', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(6, '系统是否', 'sys_yes_no', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(7, '通知类型', 'sys_notice_type', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, ''),
(8, '操作类型', 'sys_oper_type', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '');

INSERT INTO "sys_dict_data" VALUES
(1, 1, '男', '0', 'sys_user_sex', '', '', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '性别男'),
(2, 2, '女', '1', 'sys_user_sex', '', '', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '性别女'),
(3, 3, '未知', '2', 'sys_user_sex', '', '', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '性别未知'),
(4, 1, '显示', '0', 'sys_show_hide', '', '', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '显示菜单'),
(5, 2, '隐藏', '1', 'sys_show_hide', '', '', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '隐藏菜单'),
(6, 1, '正常', '0', 'sys_normal_disable', '', '', 'Y', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '正常状态'),
(7, 2, '停用', '1', 'sys_normal_disable', '', '', 'N', '0', 'admin', CURRENT_TIMESTAMP, '', NULL, '停用状态');

-- ----------------------------
-- 参数配置
-- ----------------------------
INSERT INTO "sys_config" VALUES
(1, '主框架页-默认皮肤样式名称', 'sys.index.skinName', 'skin-blue', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, '蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow'),
(2, '用户管理-账号初始密码', 'sys.user.initPassword', '123456', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, '初始化密码 123456'),
(3, '主框架页-侧边栏主题', 'sys.index.sideTheme', 'theme-dark', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, '深色主题theme-dark，浅色主题theme-light'),
(4, '账号自助-是否开启用户注册', 'sys.account.registerUser', 'false', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, '是否开启注册用户功能（true开启，false关闭）'),
(5, '账号自助-是否开启用户删除', 'sys.account.deleteUser', 'true', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, '是否允许用户删除自己的账号（true允许，false禁止）'),
(6, 'session超时时间（分钟）', 'sys.session.timeout', '30', 'Y', 'admin', CURRENT_TIMESTAMP, '', NULL, '会话超时时间，默认30分钟');

-- ----------------------------
-- OSS 配置示例
-- ----------------------------
INSERT INTO "sys_oss_config" ("oss_config_id", "config_key", "access_key", "secret_key", "bucket_name", "prefix", "endpoint", "domain", "is_https", "region", "access_policy", "status") VALUES
(1, 'minio', 'yunshu', 'yunshu123', 'yunshu', '', 'http://127.0.0.1:9000', 'http://127.0.0.1:9000/yunshu', 'N', '', '1', '0');

-- ----------------------------
-- 租户
-- ----------------------------
INSERT INTO "sys_tenant" ("tenant_id", "tenant_name", "company_id", "company_name", "license_number", "address", "domain", "intro", "package_id", "expire_time", "account_count", "status") VALUES
(0, '主租户', '0', '云枢中台主租户', '91330000MA2K000000', '浙江杭州', 'yunshu.example.com', '云枢中台主租户', NULL, '2099-12-31 23:59:59', -1, '0');

-- ----------------------------
-- 租户套餐
-- ----------------------------
INSERT INTO "sys_tenant_package" ("package_id", "package_name", "menu_ids", "remark", "status") VALUES
(1, '默认套餐', (SELECT string_agg("menu_id"::VARCHAR, ',') FROM "sys_menu"), '包含全部菜单', '0');

-- =====================================================================
-- 完成
-- =====================================================================

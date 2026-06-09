/**
 * 代码生成服务
 *
 * 提供数据库表信息获取、代码生成、预览和下载功能。
 *
 * @module @yunshu/server-express/modules/gen
 */

import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import Handlebars from 'handlebars';
import type {
  IGenTable,
  IGenColumn,
  IGenConfig,
  IGenQuery,
  IGenPreview,
  IGenResult,
  DataType,
  JavaType,
} from '@yunshu/shared';
import { createSuccessResult, createErrorResult, createPaginatedResult, calcPaginationMeta } from '@yunshu/shared';

// ============================================================================
// 常量配置
// ============================================================================

/** 默认包名 */
const DEFAULT_PACKAGE = 'com.yunshu.generator';
/** 默认作者 */
const DEFAULT_AUTHOR = '云枢';
/** 模板目录 */
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// ============================================================================
// 类型映射
// ============================================================================

/** SQL 类型到 Java 类型映射 */
const SQL_TYPE_MAP: Record<string, JavaType> = {
  varchar: 'String',
  char: 'String',
  text: 'String',
  mediumtext: 'String',
  longtext: 'String',
  int: 'Integer',
  bigint: 'Long',
  smallint: 'Short',
  tinyint: 'Byte',
  decimal: 'BigDecimal',
  float: 'Float',
  double: 'Double',
  date: 'Date',
  datetime: 'LocalDateTime',
  timestamp: 'LocalDateTime',
  time: 'LocalTime',
  year: 'Integer',
  bit: 'Boolean',
  boolean: 'Boolean',
};

/** SQL 类型到 Java 字段类型映射 */
const SQL_TO_JAVA_TYPE: Record<string, JavaType> = {
  varchar: 'String',
  char: 'String',
  text: 'String',
  mediumtext: 'String',
  longtext: 'String',
  int: 'Integer',
  bigint: 'Long',
  smallint: 'Integer',
  tinyint: 'Integer',
  decimal: 'BigDecimal',
  float: 'Double',
  double: 'Double',
  date: 'Date',
  datetime: 'LocalDateTime',
  timestamp: 'LocalDateTime',
  time: 'LocalTime',
  year: 'Integer',
  bit: 'Boolean',
  boolean: 'Boolean',
};

// ============================================================================
// Mock 数据（实际项目中应连接数据库获取）
// ============================================================================

/** Mock 数据库表数据 */
const MOCK_TABLES: IGenTable[] = [
  {
    tableName: 'sys_user',
    tableComment: '用户表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-01-15 08:00:00',
  },
  {
    tableName: 'sys_role',
    tableComment: '角色表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-01-10 10:00:00',
  },
  {
    tableName: 'sys_menu',
    tableComment: '菜单表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-01-08 09:00:00',
  },
  {
    tableName: 'sys_dept',
    tableComment: '部门表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-01-05 14:00:00',
  },
  {
    tableName: 'sys_post',
    tableComment: '岗位表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-01-03 11:00:00',
  },
  {
    tableName: 'sys_dict_type',
    tableComment: '字典类型表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-02-01 09:00:00',
  },
  {
    tableName: 'sys_dict_data',
    tableComment: '字典数据表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-02-01 09:30:00',
  },
  {
    tableName: 'sys_config',
    tableComment: '系统配置表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-02-05 10:00:00',
  },
  {
    tableName: 'sys_notice',
    tableComment: '通知公告表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-02-10 08:00:00',
  },
  {
    tableName: 'biz_order',
    tableComment: '订单表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-03-01 10:00:00',
  },
  {
    tableName: 'biz_order_item',
    tableComment: '订单明细表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-03-01 10:30:00',
  },
  {
    tableName: 'biz_product',
    tableComment: '产品表',
    tableSchema: 'yunshu',
    engine: 'InnoDB',
    createTime: '2024-03-05 09:00:00',
  },
];

/** Mock 字段数据 */
const MOCK_COLUMNS: Record<string, IGenColumn[]> = {
  sys_user: [
    {
      columnName: 'user_id',
      dataType: 'bigint',
      columnComment: '用户ID',
      isNullable: 'NO',
      isPK: true,
      columnLength: 20,
      javaType: 'Long',
      javaField: 'userId',
      isFill: false,
      idType: 'AUTO',
    },
    {
      columnName: 'username',
      dataType: 'varchar',
      columnComment: '用户名',
      isNullable: 'NO',
      isPK: false,
      columnLength: 50,
      javaType: 'String',
      javaField: 'username',
      isFill: false,
      queryType: 'eq',
    },
    {
      columnName: 'nick_name',
      dataType: 'varchar',
      columnComment: '昵称',
      isNullable: 'YES',
      isPK: false,
      columnLength: 50,
      javaType: 'String',
      javaField: 'nickName',
      isFill: false,
      queryType: 'like',
    },
    {
      columnName: 'email',
      dataType: 'varchar',
      columnComment: '邮箱',
      isNullable: 'YES',
      isPK: false,
      columnLength: 100,
      javaType: 'String',
      javaField: 'email',
      isFill: false,
      queryType: 'like',
    },
    {
      columnName: 'phone',
      dataType: 'varchar',
      columnComment: '手机号',
      isNullable: 'YES',
      isPK: false,
      columnLength: 20,
      javaType: 'String',
      javaField: 'phone',
      isFill: false,
      queryType: 'like',
    },
    {
      columnName: 'sex',
      dataType: 'char',
      columnComment: '性别（0男 1女 2未知）',
      isNullable: 'YES',
      isPK: false,
      columnLength: 1,
      javaType: 'String',
      javaField: 'sex',
      isFill: false,
      displayType: 'select',
      dictType: 'sys_user_sex',
    },
    {
      columnName: 'avatar',
      dataType: 'varchar',
      columnComment: '头像地址',
      isNullable: 'YES',
      isPK: false,
      columnLength: 255,
      javaType: 'String',
      javaField: 'avatar',
      isFill: false,
      displayType: 'image',
    },
    {
      columnName: 'status',
      dataType: 'char',
      columnComment: '状态（0正常 1停用）',
      isNullable: 'YES',
      isPK: false,
      columnLength: 1,
      javaType: 'String',
      javaField: 'status',
      isFill: false,
      displayType: 'radio',
      dictType: 'sys_normal_disable',
    },
    {
      columnName: 'login_ip',
      dataType: 'varchar',
      columnComment: '最后登录IP',
      isNullable: 'YES',
      isPK: false,
      columnLength: 128,
      javaType: 'String',
      javaField: 'loginIp',
      isFill: false,
    },
    {
      columnName: 'login_date',
      dataType: 'datetime',
      columnComment: '最后登录时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'loginDate',
      isFill: false,
    },
    {
      columnName: 'create_by',
      dataType: 'varchar',
      columnComment: '创建者',
      isNullable: 'YES',
      isPK: false,
      columnLength: 64,
      javaType: 'String',
      javaField: 'createBy',
      isFill: true,
    },
    {
      columnName: 'create_time',
      dataType: 'datetime',
      columnComment: '创建时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'createTime',
      isFill: true,
    },
    {
      columnName: 'update_by',
      dataType: 'varchar',
      columnComment: '更新者',
      isNullable: 'YES',
      isPK: false,
      columnLength: 64,
      javaType: 'String',
      javaField: 'updateBy',
      isFill: true,
    },
    {
      columnName: 'update_time',
      dataType: 'datetime',
      columnComment: '更新时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'updateTime',
      isFill: true,
    },
    {
      columnName: 'remark',
      dataType: 'text',
      columnComment: '备注',
      isNullable: 'YES',
      isPK: false,
      javaType: 'String',
      javaField: 'remark',
      isFill: false,
      displayType: 'textarea',
    },
  ],
  sys_role: [
    {
      columnName: 'role_id',
      dataType: 'bigint',
      columnComment: '角色ID',
      isNullable: 'NO',
      isPK: true,
      columnLength: 20,
      javaType: 'Long',
      javaField: 'roleId',
      isFill: false,
      idType: 'AUTO',
    },
    {
      columnName: 'role_name',
      dataType: 'varchar',
      columnComment: '角色名称',
      isNullable: 'NO',
      isPK: false,
      columnLength: 50,
      javaType: 'String',
      javaField: 'roleName',
      isFill: false,
      queryType: 'like',
    },
    {
      columnName: 'role_key',
      dataType: 'varchar',
      columnComment: '权限字符',
      isNullable: 'NO',
      isPK: false,
      columnLength: 100,
      javaType: 'String',
      javaField: 'roleKey',
      isFill: false,
      queryType: 'eq',
    },
    {
      columnName: 'role_sort',
      dataType: 'int',
      columnComment: '显示顺序',
      isNullable: 'YES',
      isPK: false,
      columnLength: 10,
      javaType: 'Integer',
      javaField: 'roleSort',
      isFill: false,
      displayType: 'input',
    },
    {
      columnName: 'status',
      dataType: 'char',
      columnComment: '状态（0正常 1停用）',
      isNullable: 'YES',
      isPK: false,
      columnLength: 1,
      javaType: 'String',
      javaField: 'status',
      isFill: false,
      displayType: 'radio',
      dictType: 'sys_normal_disable',
    },
    {
      columnName: 'create_by',
      dataType: 'varchar',
      columnComment: '创建者',
      isNullable: 'YES',
      isPK: false,
      columnLength: 64,
      javaType: 'String',
      javaField: 'createBy',
      isFill: true,
    },
    {
      columnName: 'create_time',
      dataType: 'datetime',
      columnComment: '创建时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'createTime',
      isFill: true,
    },
    {
      columnName: 'update_by',
      dataType: 'varchar',
      columnComment: '更新者',
      isNullable: 'YES',
      isPK: false,
      columnLength: 64,
      javaType: 'String',
      javaField: 'updateBy',
      isFill: true,
    },
    {
      columnName: 'update_time',
      dataType: 'datetime',
      columnComment: '更新时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'updateTime',
      isFill: true,
    },
    {
      columnName: 'remark',
      dataType: 'varchar',
      columnComment: '备注',
      isNullable: 'YES',
      isPK: false,
      columnLength: 500,
      javaType: 'String',
      javaField: 'remark',
      isFill: false,
      displayType: 'textarea',
    },
  ],
  sys_dept: [
    {
      columnName: 'dept_id',
      dataType: 'bigint',
      columnComment: '部门ID',
      isNullable: 'NO',
      isPK: true,
      columnLength: 20,
      javaType: 'Long',
      javaField: 'deptId',
      isFill: false,
      idType: 'AUTO',
    },
    {
      columnName: 'parent_id',
      dataType: 'bigint',
      columnComment: '父部门ID',
      isNullable: 'YES',
      isPK: false,
      columnLength: 20,
      javaType: 'Long',
      javaField: 'parentId',
      isFill: false,
    },
    {
      columnName: 'ancestors',
      dataType: 'varchar',
      columnComment: '祖级列表',
      isNullable: 'YES',
      isPK: false,
      columnLength: 50,
      javaType: 'String',
      javaField: 'ancestors',
      isFill: false,
    },
    {
      columnName: 'dept_name',
      dataType: 'varchar',
      columnComment: '部门名称',
      isNullable: 'YES',
      isPK: false,
      columnLength: 50,
      javaType: 'String',
      javaField: 'deptName',
      isFill: false,
      queryType: 'like',
    },
    {
      columnName: 'order_num',
      dataType: 'int',
      columnComment: '显示顺序',
      isNullable: 'YES',
      isPK: false,
      columnLength: 10,
      javaType: 'Integer',
      javaField: 'orderNum',
      isFill: false,
    },
    {
      columnName: 'leader_name',
      dataType: 'varchar',
      columnComment: '负责人',
      isNullable: 'YES',
      isPK: false,
      columnLength: 50,
      javaType: 'String',
      javaField: 'leaderName',
      isFill: false,
    },
    {
      columnName: 'phone',
      dataType: 'varchar',
      columnComment: '联系电话',
      isNullable: 'YES',
      isPK: false,
      columnLength: 20,
      javaType: 'String',
      javaField: 'phone',
      isFill: false,
    },
    {
      columnName: 'email',
      dataType: 'varchar',
      columnComment: '邮箱',
      isNullable: 'YES',
      isPK: false,
      columnLength: 100,
      javaType: 'String',
      javaField: 'email',
      isFill: false,
    },
    {
      columnName: 'status',
      dataType: 'char',
      columnComment: '部门状态（0正常 1停用）',
      isNullable: 'YES',
      isPK: false,
      columnLength: 1,
      javaType: 'String',
      javaField: 'status',
      isFill: false,
      displayType: 'radio',
      dictType: 'sys_normal_disable',
    },
    {
      columnName: 'create_by',
      dataType: 'varchar',
      columnComment: '创建者',
      isNullable: 'YES',
      isPK: false,
      columnLength: 64,
      javaType: 'String',
      javaField: 'createBy',
      isFill: true,
    },
    {
      columnName: 'create_time',
      dataType: 'datetime',
      columnComment: '创建时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'createTime',
      isFill: true,
    },
    {
      columnName: 'update_by',
      dataType: 'varchar',
      columnComment: '更新者',
      isNullable: 'YES',
      isPK: false,
      columnLength: 64,
      javaType: 'String',
      javaField: 'updateBy',
      isFill: true,
    },
    {
      columnName: 'update_time',
      dataType: 'datetime',
      columnComment: '更新时间',
      isNullable: 'YES',
      isPK: false,
      javaType: 'LocalDateTime',
      javaField: 'updateTime',
      isFill: true,
    },
  ],
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 字符串首字母大写
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 字符串转换为首字母大写的驼峰命名
 */
function toPascalCase(str: string): string {
  return str
    .split(/[_-]/)
    .map(part => capitalize(part.toLowerCase()))
    .join('');
}

/**
 * 字符串转换为首字母小写的驼峰命名
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * 下划线转驼峰
 */
function underlineToCamel(str: string): string {
  return str.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * 获取Java类型
 */
function getJavaType(dataType: string): JavaType {
  const lowerType = dataType.toLowerCase();
  return SQL_TO_JAVA_TYPE[lowerType] || 'String';
}

/**
 * 加载Handlebars模板
 */
function loadTemplate(templateName: string): HandlebarsTemplateDelegate {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`模板文件不存在: ${templateName}`);
  }
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  return Handlebars.compile(templateContent);
}

/**
 * 准备模板上下文数据
 */
function prepareTemplateData(config: IGenConfig, columns: IGenColumn[]) {
  return {
    tableName: config.tableName,
    tableComment: config.tableComment || '',
    className: config.className,
    moduleName: config.moduleName,
    packageName: config.packageName || DEFAULT_PACKAGE,
    author: config.author || DEFAULT_AUTHOR,
    email: config.email || '',
    businessName: config.businessName || '',
    functionName: config.functionName || config.tableComment || config.className,
    columns: columns,
    generateType: config.generateType,
    generateMenu: config.generateMenu,
    generateApi: config.generateApi,
    generateView: config.generateView,
    generateTypeScript: config.generateTypeScript,
    // 树表配置
    treeCodeField: config.treeCodeField || '',
    treeParentCodeField: config.treeParentCodeField || '',
    treeNameField: config.treeNameField || '',
    // 主子表配置
    masterColumn: config.masterColumn || '',
    detailColumn: config.detailColumn || '',
    detailTableName: config.detailTableName || '',
    // 工具方法
    capitalize,
    toPascalCase,
    toCamelCase,
    underlineToCamel,
    // 条件 helpers
    hasTree: config.generateType === 'tree',
    hasMasterDetail: config.generateType === 'master-detail',
    // 日期
    now: new Date().toISOString(),
  };
}

// ============================================================================
// GenService 类
// ============================================================================

export class GenService {
  /**
   * 获取数据库表分页列表
   */
  async getTablePage(params: IGenQuery): Promise<{ data: IGenTable[]; pagination: ReturnType<typeof calcPaginationMeta> }> {
    const { search, tableName, tableComment, page = 1, limit = 10, sort = 'createTime', order = 'desc' } = params;

    let filteredTables = [...MOCK_TABLES];

    // 关键词搜索
    if (search) {
      const keyword = search.toLowerCase();
      filteredTables = filteredTables.filter(
        table =>
          table.tableName.toLowerCase().includes(keyword) ||
          table.tableComment?.toLowerCase().includes(keyword)
      );
    }

    // 表名筛选
    if (tableName) {
      filteredTables = filteredTables.filter(table =>
        table.tableName.toLowerCase().includes(tableName.toLowerCase())
      );
    }

    // 表注释筛选
    if (tableComment) {
      filteredTables = filteredTables.filter(table =>
        table.tableComment?.toLowerCase().includes(tableComment.toLowerCase())
      );
    }

    // 排序
    filteredTables.sort((a, b) => {
      const aVal = (a as any)[sort] || '';
      const bVal = (b as any)[sort] || '';
      const compare = String(aVal).localeCompare(String(bVal));
      return order === 'asc' ? compare : -compare;
    });

    // 分页
    const total = filteredTables.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filteredTables.slice(start, end);

    return {
      data,
      pagination: calcPaginationMeta(page, limit, total),
    };
  }

  /**
   * 获取所有表列表
   */
  async getTableList(): Promise<IGenTable[]> {
    return MOCK_TABLES;
  }

  /**
   * 获取表详情（包含字段信息）
   */
  async getTableDetail(tableName: string): Promise<IGenColumn[]> {
    const columns = MOCK_COLUMNS[tableName];
    if (!columns) {
      // 如果没有预定义的字段数据，生成默认字段
      return this.generateDefaultColumns(tableName);
    }
    return columns;
  }

  /**
   * 生成默认字段（当表没有预定义字段时使用）
   */
  private generateDefaultColumns(tableName: string): IGenColumn[] {
    const className = toPascalCase(tableName.replace(/^sys_|^biz_/, ''));
    const primaryKey = `${underlineToCamel(tableName)}_id`;

    return [
      {
        columnName: primaryKey,
        dataType: 'bigint',
        columnComment: `${className}ID`,
        isNullable: 'NO',
        isPK: true,
        columnLength: 20,
        javaType: 'Long',
        javaField: underlineToCamel(primaryKey),
        isFill: false,
        idType: 'AUTO',
      },
      {
        columnName: 'name',
        dataType: 'varchar',
        columnComment: '名称',
        isNullable: 'YES',
        isPK: false,
        columnLength: 100,
        javaType: 'String',
        javaField: 'name',
        isFill: false,
        queryType: 'like',
      },
      {
        columnName: 'code',
        dataType: 'varchar',
        columnComment: '编码',
        isNullable: 'YES',
        isPK: false,
        columnLength: 50,
        javaType: 'String',
        javaField: 'code',
        isFill: false,
        queryType: 'eq',
      },
      {
        columnName: 'status',
        dataType: 'char',
        columnComment: '状态（0正常 1停用）',
        isNullable: 'YES',
        isPK: false,
        columnLength: 1,
        javaType: 'String',
        javaField: 'status',
        isFill: false,
        displayType: 'radio',
        dictType: 'sys_normal_disable',
      },
      {
        columnName: 'sort',
        dataType: 'int',
        columnComment: '排序',
        isNullable: 'YES',
        isPK: false,
        columnLength: 10,
        javaType: 'Integer',
        javaField: 'sort',
        isFill: false,
      },
      {
        columnName: 'remark',
        dataType: 'varchar',
        columnComment: '备注',
        isNullable: 'YES',
        isPK: false,
        columnLength: 500,
        javaType: 'String',
        javaField: 'remark',
        isFill: false,
        displayType: 'textarea',
      },
      {
        columnName: 'create_by',
        dataType: 'varchar',
        columnComment: '创建者',
        isNullable: 'YES',
        isPK: false,
        columnLength: 64,
        javaType: 'String',
        javaField: 'createBy',
        isFill: true,
      },
      {
        columnName: 'create_time',
        dataType: 'datetime',
        columnComment: '创建时间',
        isNullable: 'YES',
        isPK: false,
        javaType: 'LocalDateTime',
        javaField: 'createTime',
        isFill: true,
      },
      {
        columnName: 'update_by',
        dataType: 'varchar',
        columnComment: '更新者',
        isNullable: 'YES',
        isPK: false,
        columnLength: 64,
        javaType: 'String',
        javaField: 'updateBy',
        isFill: true,
      },
      {
        columnName: 'update_time',
        dataType: 'datetime',
        columnComment: '更新时间',
        isNullable: 'YES',
        isPK: false,
        javaType: 'LocalDateTime',
        javaField: 'updateTime',
        isFill: true,
      },
    ];
  }

  /**
   * 预览生成的代码
   */
  async previewCode(config: IGenConfig): Promise<IGenPreview> {
    const columns = await this.getTableDetail(config.tableName);
    const templateData = prepareTemplateData(config, columns);

    const files: Array<{ fileName: string; filePath: string; content: string }> = [];

    try {
      // 后端模板
      const templates = [
        { name: 'controller.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/controller/${config.className}Controller.java` },
        { name: 'service.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/service/I${config.className}Service.java` },
        { name: 'serviceImpl.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/service/impl/${config.className}ServiceImpl.java` },
        { name: 'entity.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/entity/${config.className}.java` },
        { name: 'dto.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/dto/${config.className}DTO.java` },
        { name: 'vo.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/vo/${config.className}VO.java` },
        { name: 'mapper.java.hbs', path: `${config.packageName.replace(/\./g, '/')}/mapper/${config.className}Mapper.java` },
        { name: 'sql.hbs', path: `sql/${config.tableName}.sql` },
      ];

      for (const tmpl of templates) {
        try {
          const template = loadTemplate(tmpl.name);
          const content = template(templateData);
          files.push({
            fileName: path.basename(tmpl.path),
            filePath: tmpl.path,
            content,
          });
        } catch {
          files.push({
            fileName: tmpl.name.replace('.hbs', ''),
            filePath: tmpl.path,
            content: `// 模板 ${tmpl.name} 加载失败`,
          });
        }
      }

      // 前端模板
      if (config.generateApi) {
        try {
          const apiTemplate = loadTemplate('api.ts.hbs');
          files.push({
            fileName: `${toCamelCase(config.className)}.api.ts`,
            filePath: `api/${toCamelCase(config.className)}.api.ts`,
            content: apiTemplate(templateData),
          });
        } catch {
          // 忽略
        }
      }

      if (config.generateView) {
        try {
          const vueTemplate = loadTemplate('vue/index.vue.hbs');
          files.push({
            fileName: `${toCamelCase(config.className)}.vue`,
            filePath: `views/${config.moduleName}/${toCamelCase(config.className)}/index.vue`,
            content: vueTemplate(templateData),
          });
        } catch {
          // 忽略
        }
      }

      if (config.generateTypeScript) {
        try {
          const tsTemplate = loadTemplate('types.ts.hbs');
          files.push({
            fileName: `${toCamelCase(config.className)}.types.ts`,
            filePath: `types/${toCamelCase(config.className)}.types.ts`,
            content: tsTemplate(templateData),
          });
        } catch {
          // 忽略
        }
      }
    } catch (error) {
      console.error('预览代码生成失败:', error);
    }

    return {
      tableName: config.tableName,
      files,
    };
  }

  /**
   * 生成代码（返回文件内容列表）
   */
  async generateCode(config: IGenConfig): Promise<IGenResult> {
    const preview = await this.previewCode(config);

    return {
      tableName: config.tableName,
      fileCount: preview.files.length,
      files: preview.files.map(f => f.filePath),
    };
  }

  /**
   * 生成代码并打包为ZIP
   */
  async generateCodeZip(config: IGenConfig): Promise<Buffer> {
    const preview = await this.previewCode(config);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });

      archive.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      archive.on('error', (err) => {
        reject(err);
      });

      for (const file of preview.files) {
        archive.append(file.content, { name: file.filePath });
      }

      archive.finalize();
    });
  }

  /**
   * 保存生成配置
   */
  async saveConfig(config: IGenConfig): Promise<IGenConfig> {
    // Mock: 实际应保存到数据库
    return {
      ...config,
      genId: `gen_${Date.now()}`,
      createTime: new Date().toISOString(),
    };
  }

  /**
   * 获取生成配置列表
   */
  async getConfigList(): Promise<IGenConfig[]> {
    // Mock: 实际应从数据库查询
    return [];
  }

  /**
   * 删除生成配置
   */
  async deleteConfig(genId: string): Promise<boolean> {
    // Mock: 实际应从数据库删除
    return true;
  }
}

// 导出单例
export const genService = new GenService();

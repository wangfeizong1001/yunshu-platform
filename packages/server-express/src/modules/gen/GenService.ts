/**
 * 代码生成服务
 *
 * 提供数据库表信息获取、代码生成、预览和下载功能。
 *
 * @module @yunshu/server-express/modules/gen
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  IGenTable,
  IGenColumn,
  IGenConfig,
  IGenQuery,
  IGenPreview,
  IGenResult,
} from '@yunshu/shared';
import { calcPaginationMeta } from '@yunshu/shared';

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

// SQL 到 Java 类型映射（保留供未来功能使用）
const _SQL_TO_JAVA_TYPE: Record<string, unknown> = {
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
  time: 'LocalDateTime',
  year: 'Integer',
  bit: 'Boolean',
  boolean: 'Boolean',
};
void _SQL_TO_JAVA_TYPE;

// ============================================================================
// Mock 数据（实际项目中应连接数据库获取）
// ============================================================================

/** Mock 数据库表数据 */
const MOCK_TABLES: IGenTable[] = [
  {
    tableName: 'sys_user',
    tableComment: '用户表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-15 08:00:00',
  },
  {
    tableName: 'sys_role',
    tableComment: '角色表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-10 10:00:00',
  },
  {
    tableName: 'sys_menu',
    tableComment: '菜单表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-08 09:00:00',
  },
  {
    tableName: 'sys_dept',
    tableComment: '部门表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-05 14:00:00',
  },
  {
    tableName: 'sys_post',
    tableComment: '岗位表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-01-03 11:00:00',
  },
  {
    tableName: 'sys_dict_type',
    tableComment: '字典类型表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-02-01 09:00:00',
  },
  {
    tableName: 'sys_dict_data',
    tableComment: '字典数据表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-02-01 09:30:00',
  },
  {
    tableName: 'sys_config',
    tableComment: '系统配置表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-02-05 10:00:00',
  },
  {
    tableName: 'sys_notice',
    tableComment: '通知公告表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-02-10 08:00:00',
  },
  {
    tableName: 'biz_order',
    tableComment: '订单表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-03-01 10:00:00',
  },
  {
    tableName: 'biz_order_item',
    tableComment: '订单明细表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
    createTime: '2024-03-01 10:30:00',
  },
  {
    tableName: 'biz_product',
    tableComment: '产品表',
    tableSchema: 'yunshu',
    engine: 'PostgreSQL',
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
 * 首字母大写
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 下划线转帕斯卡命名（大驼峰）
 */
function toPascalCase(str: string): string {
  return str.split('_').map(part => capitalize(part.toLowerCase())).join('');
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
  return str.replace(/_(\w)/g, (_match, letter: string) => letter.toUpperCase());
}

/**
 * 加载模板内容
 */
function loadTemplateContent(templateName: string): string {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  if (!fs.existsSync(templatePath)) {
    return `// ${templateName} template placeholder`;
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * 简单模板渲染（使用双花括号占位符）
 */
function renderTemplate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
    const value = data[key];
    return value !== undefined ? String(value) : '';
  });
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
    treeCodeField: config.treeCodeField || '',
    treeParentCodeField: config.treeParentCodeField || '',
    treeNameField: config.treeNameField || '',
    masterColumn: config.masterColumn || '',
    detailColumn: config.detailColumn || '',
    detailTableName: config.detailTableName || '',
    capitalize,
    toPascalCase,
    toCamelCase,
    underlineToCamel,
    hasTree: config.generateType === 'tree',
    hasMasterDetail: config.generateType === 'master-detail',
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

    if (search) {
      const keyword = search.toLowerCase();
      filteredTables = filteredTables.filter(
        table =>
          table.tableName.toLowerCase().includes(keyword) ||
          table.tableComment?.toLowerCase().includes(keyword)
      );
    }

    if (tableName) {
      filteredTables = filteredTables.filter(table =>
        table.tableName.toLowerCase().includes(tableName.toLowerCase())
      );
    }

    if (tableComment) {
      filteredTables = filteredTables.filter(table =>
        table.tableComment?.toLowerCase().includes(tableComment.toLowerCase())
      );
    }

    filteredTables.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sort] || '';
      const bVal = (b as unknown as Record<string, unknown>)[sort] || '';
      const compare = String(aVal).localeCompare(String(bVal));
      return order === 'asc' ? compare : -compare;
    });

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
   * 导入数据库表
   */
  async importTables(tableNames: string[]): Promise<{ imported: number }> {
    // Mock: 实际应从数据库读取表信息并生成配置
    return { imported: tableNames.length };
  }

  /**
   * 同步数据库表信息
   */
  async syncTable(_tableName: string): Promise<{ success: boolean }> {
    // Mock: 实际应从数据库读取最新表结构并更新
    return { success: true };
  }

  /**
   * 预览代码
   */
  async previewCode(config: IGenConfig): Promise<IGenPreview> {
    const columns = await this.getTableDetail(config.tableName);
    const templateData = prepareTemplateData(config, columns);

    const entityTemplate = loadTemplateContent('entity.java.hbs');
    const controllerTemplate = loadTemplateContent('controller.java.hbs');
    const serviceTemplate = loadTemplateContent('service.java.hbs');
    const mapperTemplate = loadTemplateContent('mapper.java.hbs');
    const vueTemplate = loadTemplateContent('page.vue.hbs');
    const apiTemplate = loadTemplateContent('api.ts.hbs');
    const typesTemplate = loadTemplateContent('types.ts.hbs');

    const files = [
      {
        fileName: `${config.className}.java`,
        filePath: `src/main/java/${config.packageName.replace(/\./g, '/')}/domain/${config.className}.java`,
        content: renderTemplate(entityTemplate, templateData),
        language: 'java',
      },
      {
        fileName: `${config.className}Controller.java`,
        filePath: `src/main/java/${config.packageName.replace(/\./g, '/')}/controller/${config.className}Controller.java`,
        content: renderTemplate(controllerTemplate, templateData),
        language: 'java',
      },
      {
        fileName: `I${config.className}Service.java`,
        filePath: `src/main/java/${config.packageName.replace(/\./g, '/')}/service/I${config.className}Service.java`,
        content: renderTemplate(serviceTemplate, templateData),
        language: 'java',
      },
      {
        fileName: `${config.className}Mapper.java`,
        filePath: `src/main/java/${config.packageName.replace(/\./g, '/')}/mapper/${config.className}Mapper.java`,
        content: renderTemplate(mapperTemplate, templateData),
        language: 'java',
      },
      {
        fileName: 'index.vue',
        filePath: `src/views/${config.moduleName}/index.vue`,
        content: renderTemplate(vueTemplate, templateData),
        language: 'vue',
      },
      {
        fileName: `${toCamelCase(config.tableName)}.ts`,
        filePath: `src/api/${config.moduleName}/${toCamelCase(config.tableName)}.ts`,
        content: renderTemplate(apiTemplate, templateData),
        language: 'typescript',
      },
      {
        fileName: 'types.ts',
        filePath: `src/types/${config.moduleName}.ts`,
        content: renderTemplate(typesTemplate, templateData),
        language: 'typescript',
      },
    ];

    return {
      tableName: config.tableName,
      files,
    };
  }

  /**
   * 生成代码
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

    // 简单的 ZIP 文件生成（不依赖外部库）
    // 注意：这是最小化的 ZIP 实现，实际项目推荐使用 archiver
    const fileEntries: Array<{ name: string; data: Buffer }> = preview.files.map(file => ({
      name: file.filePath,
      data: Buffer.from(file.content, 'utf-8'),
    }));

    return buildSimpleZip(fileEntries);
  }

  /**
   * 保存生成配置
   */
  async saveConfig(config: IGenConfig): Promise<IGenConfig> {
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
    return [];
  }

  /**
   * 删除生成配置
   */
  async deleteConfig(_genId: string): Promise<boolean> {
    return true;
  }
}

/**
 * 构建简单的 ZIP 文件（纯 Node.js 实现）
 * 仅支持基本的未压缩存储，适用于代码生成导出场景
 */
function buildSimpleZip(files: Array<{ name: string; data: Buffer }>): Buffer {
  const chunks: Buffer[] = [];
  const centralDir: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBuffer = Buffer.from(file.name, 'utf-8');
    const fileData = file.data;

    // Local file header
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc32(fileData), 14);
    localHeader.writeUInt32LE(fileData.length, 18);
    localHeader.writeUInt32LE(fileData.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    chunks.push(localHeader);
    chunks.push(nameBuffer);
    chunks.push(fileData);

    // Central directory entry
    const centralEntry = Buffer.alloc(46);
    centralEntry.writeUInt32LE(0x02014b50, 0);
    centralEntry.writeUInt16LE(20, 4);
    centralEntry.writeUInt16LE(0, 6);
    centralEntry.writeUInt16LE(0, 8);
    centralEntry.writeUInt16LE(0, 10);
    centralEntry.writeUInt16LE(0, 12);
    centralEntry.writeUInt32LE(crc32(fileData), 14);
    centralEntry.writeUInt32LE(fileData.length, 18);
    centralEntry.writeUInt32LE(fileData.length, 22);
    centralEntry.writeUInt16LE(nameBuffer.length, 26);
    centralEntry.writeUInt16LE(0, 28);
    centralEntry.writeUInt16LE(0, 30);
    centralEntry.writeUInt16LE(0, 32);
    centralEntry.writeUInt16LE(0, 34);
    centralEntry.writeUInt32LE(0, 36);
    centralEntry.writeUInt32LE(offset, 40);
    centralEntry.writeUInt16LE(0, 44);

    centralDir.push(centralEntry);
    centralDir.push(nameBuffer);

    offset += localHeader.length + nameBuffer.length + fileData.length;
  }

  // End of central directory
  const centralDirSize = centralDir.reduce((sum, b) => sum + b.length, 0);
  const endOfCentralDir = Buffer.alloc(22);
  endOfCentralDir.writeUInt32LE(0x06054b50, 0);
  endOfCentralDir.writeUInt16LE(0, 4);
  endOfCentralDir.writeUInt16LE(0, 6);
  endOfCentralDir.writeUInt16LE(files.length, 8);
  endOfCentralDir.writeUInt16LE(files.length, 10);
  endOfCentralDir.writeUInt32LE(centralDirSize, 12);
  endOfCentralDir.writeUInt32LE(offset, 16);
  endOfCentralDir.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, ...centralDir, endOfCentralDir]);
}

/**
 * CRC32 计算（用于 ZIP 文件校验）
 */
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// 导出单例
export const genService = new GenService();

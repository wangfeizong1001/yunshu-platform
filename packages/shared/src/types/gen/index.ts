/**
 * 代码生成器类型定义
 *
 * @module @yunshu/shared/types/gen
 */

/** 生成类型 */
export type GenerateType = 'single' | 'tree' | 'master-detail';

/** 数据类型映射 */
export type DataType =
  | 'varchar'
  | 'char'
  | 'text'
  | 'mediumtext'
  | 'longtext'
  | 'int'
  | 'bigint'
  | 'smallint'
  | 'tinyint'
  | 'decimal'
  | 'float'
  | 'double'
  | 'date'
  | 'datetime'
  | 'timestamp'
  | 'time'
  | 'year'
  | 'boolean'
  | 'bit';

/** Java 类型映射 */
export type JavaType =
  | 'String'
  | 'Integer'
  | 'Long'
  | 'Double'
  | 'BigDecimal'
  | 'Boolean'
  | 'Date'
  | 'LocalDate'
  | 'LocalDateTime'
  | 'MultipartFile'
  | 'byte[]';

/** 字段实体 */
export interface IGenColumn {
  /** 字段名称 */
  columnName: string;
  /** 数据类型 */
  dataType: DataType;
  /** 字段注释 */
  columnComment?: string;
  /** 是否为空 */
  isNullable: 'YES' | 'NO';
  /** 是否主键 */
  isPK: boolean;
  /** 字段长度 */
  columnLength?: number;
  /** 小数精度 */
  numericPrecision?: number;
  /** 小数位数 */
  numericScale?: number;
  /** 默认值 */
  columnDefault?: string;
  /** Java 类型 */
  javaType: JavaType;
  /** Java 字段名 */
  javaField: string;
  /** 是否为填充字段 */
  isFill?: boolean;
  /** 查询类型（eq/ne/like/gt/lt/between/in） */
  queryType?: 'eq' | 'ne' | 'like' | 'gt' | 'lt' | 'between' | 'in';
  /** 显示类型（input/select/checkbox/radio/date/datetime/time/textarea/editor/image/file） */
  displayType?:
    | 'input'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'datetime'
    | 'time'
    | 'textarea'
    | 'editor'
    | 'image'
    | 'file';
  /** 字典类型 */
  dictType?: string;
  /** 主键策略（NONE/AUTO/INPUT/UUID） */
  idType?: 'NONE' | 'AUTO' | 'INPUT' | 'UUID';
  /** 是否在列表中显示 */
  isDisplay?: boolean;
  /** 是否在表单中显示 */
  isForm?: boolean;
  /** 是否在查询中显示 */
  isQuery?: boolean;
}

/** 代码生成配置 */
export interface IGenConfig {
  /** 主键ID */
  genId?: string;
  /** 表名称 */
  tableName: string;
  /** 表注释 */
  tableComment?: string;
  /** 类名称 */
  className: string;
  /** 模块名称 */
  moduleName: string;
  /** 包名称 */
  packageName: string;
  /** 作者 */
  author: string;
  /** 邮箱 */
  email?: string;
  /** 生成类型 */
  generateType: GenerateType;
  /** 生成菜单 */
  generateMenu: boolean;
  /** 生成前端 API */
  generateApi: boolean;
  /** 生成前端页面 */
  generateView: boolean;
  /** 生成 TypeScript 类型 */
  generateTypeScript: boolean;
  /** 业务名称 */
  businessName?: string;
  /** 功能名称 */
  functionName?: string;
  /** 树编码字段 */
  treeCodeField?: string;
  /** 树父编码字段 */
  treeParentCodeField?: string;
  /** 树名称字段 */
  treeNameField?: string;
  /** 主表关联字段 */
  masterColumn?: string;
  /** 子表关联字段 */
  detailColumn?: string;
  /** 子表名称 */
  detailTableName?: string;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 字段列表 */
  columns?: IGenColumn[];
}

/** 代码生成表（数据库表） */
export interface IGenTable {
  /** 表名称 */
  tableName: string;
  /** 表注释 */
  tableComment?: string;
  /** 表空间 */
  tableSchema?: string;
  /** 引擎类型 */
  engine?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

/** 代码生成完整信息（包含字段） */
export interface IGenTableFull extends IGenTable {
  /** 字段列表 */
  columns: IGenColumn[];
  /** 生成配置 */
  config?: IGenConfig;
}

/** 代码生成查询参数 */
export interface IGenQuery {
  /** 关键词搜索 */
  search?: string;
  /** 表名称 */
  tableName?: string;
  /** 表注释 */
  tableComment?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向 */
  order?: 'asc' | 'desc';
}

/** 代码预览项 */
export interface IGenPreviewItem {
  /** 文件名 */
  fileName: string;
  /** 文件路径 */
  filePath: string;
  /** 文件内容 */
  content: string;
  /** 文件语言类型 */
  language?: string;
}

/** 代码预览响应 */
export interface IGenPreview {
  /** 表名 */
  tableName: string;
  /** 预览文件列表 */
  files: IGenPreviewItem[];
}

/** 代码生成结果 */
export interface IGenResult {
  /** 生成表名 */
  tableName: string;
  /** 生成文件数 */
  fileCount: number;
  /** 文件列表 */
  files: string[];
  /** 下载地址 */
  downloadUrl?: string;
}

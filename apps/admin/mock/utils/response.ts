/**
 * 统一响应格式
 * @module mock/response
 */

/** 通用响应结构 */
export interface Response<T = any> {
  /** 状态码：200=成功，其他=失败 */
  code: number
  /** 消息 */
  msg: string
  /** 数据 */
  data?: T
  /** 总数（分页用） */
  total?: number
  /** 页码 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 成功响应
 * @param data 返回数据
 * @param msg 成功消息
 */
export function success<T>(data?: T, msg = '操作成功'): Response<T> {
  return { code: 200, msg, data }
}

/**
 * 失败响应
 * @param msg 错误消息
 * @param code 错误码，默认500
 */
export function fail(msg = '操作失败', code = 500): Response {
  return { code, msg }
}

/**
 * 分页结果响应
 * @param list 数据列表
 * @param total 总数
 * @param pageNum 页码
 * @param pageSize 每页数量
 */
export function pageResult<T>(
  list: T[],
  total: number,
  pageNum: number,
  pageSize: number
): Response<{ rows: T[]; total: number }> {
  return {
    code: 200,
    msg: '查询成功',
    data: {
      rows: list,
      total
    },
    total,
    pageNum,
    pageSize
  }
}

/**
 * 树形结构响应（用于菜单、部门的层级数据）
 * @param tree 树形数据
 */
export function treeResult<T>(tree: T[]): Response<T[]> {
  return { code: 200, msg: '查询成功', data: tree }
}

/**
 * 布尔结果响应
 * @param result 操作结果
 * @param successMsg 成功消息
 * @param failMsg 失败消息
 */
export function boolResult(result: boolean, successMsg = '操作成功', failMsg = '操作失败'): Response<boolean> {
  return result ? success(result, successMsg) : fail(failMsg, 500)
}

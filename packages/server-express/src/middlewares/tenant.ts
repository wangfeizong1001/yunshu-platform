/**
 * 租户上下文
 * 用于在请求处理过程中存储和访问当前租户ID
 */

/** 租户上下文 */
class TenantContext {
  private static instance: TenantContext
  private tenantId: string | null = null

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): TenantContext {
    if (!TenantContext.instance) {
      TenantContext.instance = new TenantContext()
    }
    return TenantContext.instance
  }

  /**
   * 设置当前租户ID
   * @param tenantId 租户ID
   */
  set(tenantId: string): void {
    this.tenantId = tenantId
  }

  /**
   * 获取当前租户ID
   */
  get(): string | null {
    return this.tenantId
  }

  /**
   * 清除租户上下文
   */
  clear(): void {
    this.tenantId = null
  }

  /**
   * 是否存在有效的租户上下文
   */
  has(): boolean {
    return this.tenantId !== null && this.tenantId !== undefined
  }
}

export const tenantContext = TenantContext.getInstance()

/**
 * 租户中间件
 * 从请求头获取租户ID并设置到上下文
 */
export function tenantMiddleware(req, res, next) {
  // 从请求头获取租户ID
  const tenantId = req.headers['tenant-id']

  if (tenantId) {
    req.tenantId = tenantId
    // 设置租户上下文
    tenantContext.set(tenantId as string)
  }

  next()
}

/**
 * 获取当前请求的租户ID
 */
export function getCurrentTenantId(): string | null {
  return tenantContext.get()
}

/**
 * 清除租户上下文
 */
export function clearTenantContext(): void {
  tenantContext.clear()
}

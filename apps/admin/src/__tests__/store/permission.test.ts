/**
 * permission store 单元测试
 *
 * 覆盖：
 *  1. 初始状态：routes/addRoutes/dynamicRouteAdded 均为空
 *  2. generateRoutes 后 routes 包含静态 + 动态路由
 *  3. resetRoutes 后所有状态清空（含 dynamicRouteAdded）
 *  4. 后端获取菜单失败时仍能降级到 asyncRoutes
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePermissionStore } from '@/store/modules/permission'

// Mock API 层
vi.mock('@/api/auth', () => ({
  getRoutersApi: vi.fn(),
}))

import { getRoutersApi } from '@/api/auth'

const mockedGetRoutersApi = vi.mocked(getRoutersApi)

describe('usePermissionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('初始状态应全部为空', () => {
    const store = usePermissionStore()
    expect(store.routes).toEqual([])
    expect(store.addRoutes).toEqual([])
    expect(store.defaultRoutes).toEqual([])
    expect(store.topbarRouters).toEqual([])
    expect(store.cachedViews).toEqual([])
  })

  it('generateRoutes 成功后应包含 constantRoutes + 动态路由', async () => {
    mockedGetRoutersApi.mockResolvedValueOnce({
      data: [
        {
          menuType: 'M',
          path: '/test',
          menuName: '测试模块',
          icon: 'test',
          isCache: '0',
          children: [],
        },
      ],
    } as any)

    const store = usePermissionStore()
    const allRoutes = await store.generateRoutes()

    // 至少包含一条动态路由
    expect(allRoutes.length).toBeGreaterThan(0)
    // routes 包含 constantRoutes
    expect(store.routes.length).toBeGreaterThan(allRoutes.length)
    // addRoutes 等于返回的动态路由
    expect(store.addRoutes).toEqual(allRoutes)
  })

  it('后端失败时应降级到 asyncRoutes（保证基本功能可用）', async () => {
    mockedGetRoutersApi.mockRejectedValueOnce(new Error('Network Error'))

    const store = usePermissionStore()
    const allRoutes = await store.generateRoutes()

    // 失败时仍应返回非空路由（asyncRoutes）
    expect(allRoutes.length).toBeGreaterThan(0)
    // routes 包含 constantRoutes
    expect(store.routes.length).toBeGreaterThan(0)
  })

  it('resetRoutes 应清空所有状态（含新加的 dynamicRouteAdded）', async () => {
    // 先触发 generateRoutes 让状态有内容
    mockedGetRoutersApi.mockResolvedValueOnce({ data: [] } as any)
    const store = usePermissionStore()
    await store.generateRoutes()

    // 验证有数据
    expect(store.routes.length).toBeGreaterThan(0)
    expect(store.addRoutes.length).toBeGreaterThan(0)

    // 模拟路由守卫中标记已添加
    store.dynamicRouteAdded = true

    // 重置
    store.resetRoutes()

    // 全部清空
    expect(store.routes).toEqual([])
    expect(store.addRoutes).toEqual([])
    expect(store.defaultRoutes).toEqual([])
    expect(store.topbarRouters).toEqual([])
    expect(store.cachedViews).toEqual([])
    expect(store.dynamicRouteAdded).toBe(false)
  })

  it('dynamicRouteAdded 应在 generateRoutes 成功后保持 false（由 router 守卫标记）', async () => {
    // 这是一个约定：store 不主动标记，由 router 守卫在 addRoute 后标记
    mockedGetRoutersApi.mockResolvedValueOnce({ data: [] } as any)
    const store = usePermissionStore()
    await store.generateRoutes()
    expect(store.dynamicRouteAdded).toBe(false)
  })
})

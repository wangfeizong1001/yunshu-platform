/**
 * locale store 单元测试
 *
 * 验证 store 是响应式的（修改后界面应自动更新），
 * 覆盖以下场景：
 *  1. 默认值为 'zh-CN'
 *  2. setLocale 切换后 currentLocale 立即更新
 *  3. locales 列表暴露给模板渲染
 *  4. getLocale 应返回当前语言
 *  5. initLocale 根据浏览器语言自动设置
 *  6. 切回 localStorage 时值能正确恢复
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLocaleStore } from '@/store/modules/locale'

describe('useLocaleStore', () => {
  beforeEach(() => {
    // 清理 localStorage 避免上一个测试的状态干扰
    localStorage.clear()
    // 为每个测试创建独立的 pinia 实例
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('默认值应为 zh-CN', () => {
    const store = useLocaleStore()
    expect(store.currentLocale).toBe('zh-CN')
  })

  it('setLocale 后 currentLocale 应立即更新（响应式）', () => {
    const store = useLocaleStore()
    store.setLocale('en')
    expect(store.currentLocale).toBe('en')
  })

  it('locales 列表应包含中英文', () => {
    const store = useLocaleStore()
    expect(store.locales).toHaveLength(2)
    expect(store.locales.map(l => l.value)).toEqual(['zh-CN', 'en'])
  })

  it('getLocale 应返回当前语言', () => {
    const store = useLocaleStore()
    expect(store.getLocale()).toBe('zh-CN')
    store.setLocale('en')
    expect(store.getLocale()).toBe('en')
  })

  it('initLocale 应根据 navigator.language 自动设置', () => {
    // 模拟浏览器为中文
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('zh-CN')
    const store = useLocaleStore()
    store.initLocale()
    expect(store.currentLocale).toBe('zh-CN')
  })

  it('initLocale 应识别 en-* 浏览器语言并切换为 en', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
    const store = useLocaleStore()
    store.initLocale()
    expect(store.currentLocale).toBe('en')
  })

  it('从 localStorage 恢复时仍为响应式（reactive ref）', async () => {
    // 先创建 store 并切换到 en，让 vueuse 持久化到 localStorage
    const store1 = useLocaleStore()
    store1.setLocale('en')
    expect(store1.currentLocale).toBe('en')
    // 等待 vueuse 的 watch 触发（同步 set 后 microtask 才会写 localStorage）
    await new Promise(resolve => setTimeout(resolve, 0))
    // 验证 localStorage 中确实写入了 'en'（去引号兼容）
    const raw = localStorage.getItem('locale') || ''
    expect(raw.replace(/^"|"$/g, '')).toBe('en')

    // 重新创建 pinia 触发初始化
    setActivePinia(createPinia())
    const store2 = useLocaleStore()
    // 关键断言：从 localStorage 恢复出来的值应该等于 'en'
    expect(store2.currentLocale).toBe('en')
    // 关键：再次切换应继续响应式
    store2.setLocale('zh-CN')
    expect(store2.currentLocale).toBe('zh-CN')
  })
})

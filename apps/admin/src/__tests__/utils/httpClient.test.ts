import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  useRequest,
  ApiResponse,
} from '@/utils/httpClient'
import { setToken, removeToken } from '@/utils/auth'

vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
  ElLoading: {
    service: vi.fn(() => ({ close: vi.fn() })),
  },
}))

const mockRequest = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      request: (config: unknown) => mockRequest(config),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}))

describe('httpClient.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    removeToken()
  })

  describe('ApiResponse 类型契约', () => {
    it('响应应包含 success 字段', () => {
      const sample: ApiResponse<string> = {
        success: true,
        data: 'test',
        message: 'ok',
      }
      expect(sample.success).toBe(true)
      expect(sample.data).toBe('test')
    })
  })

  describe('HTTP 便捷方法', () => {
    beforeEach(() => {
      mockRequest.mockImplementation(
        (config: { method?: string; url?: string; data?: unknown; params?: unknown }) => {
          return Promise.resolve({
            data: {
              success: true,
              data: config.data ?? config.params ?? { items: [1, 2, 3] },
              message: 'ok',
            },
          })
        },
      )
    })

    it('httpGet 应该调用并返回 ApiResponse', async () => {
      const result = await httpGet<{ items: number[] }>('/api/test')
      expect(result.success).toBe(true)
      expect(result.data?.items).toEqual([1, 2, 3])
    })

    it('httpPost 应该发送 POST 请求', async () => {
      const result = await httpPost<{ name: string }>('/api/test', { name: 'test' })
      expect(result.success).toBe(true)
      const callArgs = mockRequest.mock.calls[0][0] as { method: string; data: unknown }
      expect(callArgs.method?.toUpperCase()).toBe('POST')
      expect(callArgs.data).toEqual({ name: 'test' })
    })

    it('httpPut 应该发送 PUT 请求', async () => {
      await httpPut('/api/test/1', { name: 'updated' })
      const callArgs = mockRequest.mock.calls[0][0] as { method: string }
      expect(callArgs.method?.toUpperCase()).toBe('PUT')
    })

    it('httpDelete 应该发送 DELETE 请求', async () => {
      await httpDelete('/api/test/1')
      const callArgs = mockRequest.mock.calls[0][0] as { method: string }
      expect(callArgs.method?.toUpperCase()).toBe('DELETE')
    })

    it('请求失败时应该 reject', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Network Error'))
      await expect(httpGet('/api/fail')).rejects.toThrow('Network Error')
    })
  })

  describe('useRequest composable', () => {
    it('应该初始返回 loading=false', () => {
      const fetcher = vi.fn().mockResolvedValue('data')
      const { loading } = useRequest(fetcher, { immediate: false })
      expect(loading.value).toBe(false)
    })

    it('execute 应该调用 fetcher 并更新状态', async () => {
      const fetcher = vi.fn().mockResolvedValue('result')
      const { data, loading, execute } = useRequest(fetcher, { immediate: false })

      const promise = execute()
      expect(loading.value).toBe(true)
      await promise
      expect(loading.value).toBe(false)
      expect(data.value).toBe('result')
      expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('execute 失败时应该设置 error', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('fail'))
      const { error, execute } = useRequest(fetcher, { immediate: false })

      await expect(execute()).rejects.toThrow('fail')
      expect(error.value).not.toBeNull()
      expect(error.value?.message).toBe('fail')
    })

    it('immediate=true 时应该自动调用', async () => {
      const fetcher = vi.fn().mockResolvedValue('auto')
      const { execute, data } = useRequest(fetcher, { immediate: true })

      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(data.value).toBe('auto')
      await execute()
      expect(fetcher).toHaveBeenCalledTimes(2)
    })
  })

  describe('请求拦截器 Token 注入', () => {
    it('设置 Token 后请求应该被正常执行', async () => {
      setToken('test-jwt-for-interceptor')
      mockRequest.mockResolvedValueOnce({
        data: { success: true, data: { ok: true } },
      })

      const result = await httpGet<{ ok: boolean }>('/api/auth-test')
      expect(result.success).toBe(true)
      expect(mockRequest).toHaveBeenCalledTimes(1)

      removeToken()
    })
  })
})

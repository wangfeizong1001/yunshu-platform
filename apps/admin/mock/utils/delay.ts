/**
 * 响应延迟工具
 * @module mock/delay
 */

/**
 * 固定延迟
 * @param ms 延迟毫秒数，默认300ms
 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 随机延迟
 * @param minMs 最小毫秒数，默认200ms
 * @param maxMs 最大毫秒数，默认700ms
 */
export function randomDelay(minMs: number = 200, maxMs: number = 700): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return delay(ms)
}

/**
 * 模拟网络不稳定时的延迟
 * @param baseMs 基础延迟毫秒数
 */
export function unstableDelay(baseMs: number = 300): Promise<void> {
  // 90%概率正常延迟，10%概率2-3倍延迟
  const multiplier = Math.random() > 0.9 ? Math.floor(Math.random() * 2) + 2 : 1
  return delay(baseMs * multiplier)
}

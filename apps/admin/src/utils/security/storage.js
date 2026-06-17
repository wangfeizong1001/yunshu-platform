/**
 * 云枢中台 — 类型安全的本地存储工具
 *
 * 与旧式 LocalStorage 对象的区别：
 *   1. 不允许 any，通过泛型约束存取类型
 *   2. 不存储敏感信息（Token 走 authStorage）
 *   3. 提供 TTL 过期机制，避免数据长期污染
 *   4. 提供强类型 API
 *
 * @module security/storage
 */
// ─── 内部工具 ────────────────────────────────────────────────
function getDriver(driver) {
    return driver === 'local' ? localStorage : sessionStorage;
}
function now() {
    return Date.now();
}
function tryParse(text) {
    if (text === null)
        return null;
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}
function isExpired(env) {
    return typeof env.e === 'number' && env.e < now();
}
// ─── 公共 API ────────────────────────────────────────────────
/**
 * 读取一个值
 * @template T 期望的返回类型（由调用方显式传入）
 * @param key 存储键
 * @param driver 使用 localStorage 还是 sessionStorage
 * @returns 值或 null（当键不存在或已过期时）
 */
export function storageGet(key, driver = 'local') {
    const raw = getDriver(driver).getItem(key);
    const parsed = tryParse(raw);
    if (!parsed)
        return null;
    if (isExpired(parsed)) {
        getDriver(driver).removeItem(key);
        return null;
    }
    return parsed.v;
}
/**
 * 写入一个值
 * @template T 值类型
 * @param key 存储键
 * @param value 值
 * @param ttlMs 可选：存活时间（毫秒），超过后读取自动返回 null
 * @param driver 存储驱动
 */
export function storageSet(key, value, ttlMs, driver = 'local') {
    const env = {
        v: value,
        t: now(),
        e: ttlMs ? now() + ttlMs : undefined
    };
    try {
        getDriver(driver).setItem(key, JSON.stringify(env));
    }
    catch {
        // QuotaExceededError 等 —— 静默失败
    }
}
/**
 * 删除一个键
 */
export function storageRemove(key, driver = 'local') {
    getDriver(driver).removeItem(key);
}
/**
 * 清空所有存储键（慎用！）
 */
export function storageClear(driver = 'local') {
    getDriver(driver).clear();
}
/**
 * 检查键是否存在且未过期
 */
export function storageHas(key, driver = 'local') {
    return storageGet(key, driver) !== null;
}
/**
 * 原子更新一个值（读取-修改-写入）
 * @param key 存储键
 * @param updater 更新函数，接收当前值（可能为 null），返回新值
 * @param driver 存储驱动
 */
export function storageUpdate(key, updater, driver = 'local') {
    const prev = storageGet(key, driver);
    const next = updater(prev);
    storageSet(key, next, undefined, driver);
    return next;
}
// ─── 便捷前缀 ────────────────────────────────────────────────
/** 统一的键前缀，避免与其他应用冲突 */
const APP_PREFIX = 'yunshu:';
/** 构建带前缀的键 */
export function pkey(name) {
    return `${APP_PREFIX}${name}`;
}
//# sourceMappingURL=storage.js.map
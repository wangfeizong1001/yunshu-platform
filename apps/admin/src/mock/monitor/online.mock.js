/**
 * 在线用户 Mock 数据
 *
 * @module @yunshu/admin/mock/monitor
 */
export const onlineMockData = Array.from({ length: 30 }, (_, i) => {
    const isMobile = i % 5 === 0;
    return {
        sessionId: `session_${i + 1}_${Date.now()}`,
        userName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
        loginAccount: `user${i + 1}`,
        deptName: ['技术部', '运营部', '市场部', '财务部', '人事部'][i % 5],
        browser: isMobile ? 'Mobile Browser' : ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4],
        os: isMobile
            ? ['iOS 17', 'Android 14', 'HarmonyOS'][i % 3]
            : ['Windows 10', 'macOS', 'Linux'][i % 3],
        ip: `192.168.${i % 255}.${(i % 200) + 1}`,
        loginTime: new Date(Date.now() - i * 600000).toISOString(),
        lastAccessTime: new Date(Date.now() - i * 60000).toISOString(),
        expireTime: new Date(Date.now() + 30 * 60000).toISOString(),
        userId: String(1000 + i),
    };
});
//# sourceMappingURL=online.mock.js.map
/**
 * 租户套餐 Mock 数据
 */
/** 模拟套餐数据 */
const mockPackages = [
    {
        packageId: 1,
        packageName: '免费版',
        packageType: '0',
        menuIds: [1, 2, 3],
        expireType: '0',
        expireTime: '',
        userLimit: 20,
        storageLimit: 1024,
        flowLimit: 10,
        price: 0,
        status: '0',
        remark: '适合个人或小团队使用',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
    },
    {
        packageId: 2,
        packageName: '基础版',
        packageType: '1',
        menuIds: [1, 2, 3, 4, 5],
        expireType: '1',
        expireTime: '',
        userLimit: 50,
        storageLimit: 5120,
        flowLimit: 100,
        price: 2999,
        status: '0',
        remark: '适合中小企业使用',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
    },
    {
        packageId: 3,
        packageName: '高级版',
        packageType: '2',
        menuIds: [1, 2, 3, 4, 5, 6, 7, 8],
        expireType: '1',
        expireTime: '',
        userLimit: 200,
        storageLimit: 20480,
        flowLimit: 500,
        price: 9999,
        status: '0',
        remark: '适合大型企业使用',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
    },
    {
        packageId: 4,
        packageName: '旗舰版',
        packageType: '2',
        menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        expireType: '1',
        expireTime: '',
        userLimit: 500,
        storageLimit: 102400,
        flowLimit: 2000,
        price: 29999,
        status: '0',
        remark: '适合集团型企业，支持私有部署',
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00',
    },
    {
        packageId: 5,
        packageName: '试用版',
        packageType: '0',
        menuIds: [1, 2, 3],
        expireType: '2',
        expireTime: '2024-12-31 23:59:59',
        userLimit: 10,
        storageLimit: 512,
        flowLimit: 5,
        price: 0,
        status: '1',
        remark: '仅供试用，到期自动回收',
        createTime: '2024-03-01 00:00:00',
        updateTime: '2024-03-01 00:00:00',
    },
];
/** 分页查询套餐 */
export function getPackagePage(params) {
    const { keyword, status, packageType, pageNum = 1, pageSize = 10 } = params || {};
    let filtered = [...mockPackages];
    if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = filtered.filter(p => p.packageName.toLowerCase().includes(kw) || p.remark.toLowerCase().includes(kw));
    }
    if (status) {
        filtered = filtered.filter(p => p.status === status);
    }
    if (packageType) {
        filtered = filtered.filter(p => p.packageType === packageType);
    }
    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filtered.slice(start, end);
    return { total, rows };
}
/** 获取套餐列表 */
export function getPackageList(params) {
    const { keyword, status, packageType } = params || {};
    let filtered = [...mockPackages];
    if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = filtered.filter(p => p.packageName.toLowerCase().includes(kw) || p.remark.toLowerCase().includes(kw));
    }
    if (status) {
        filtered = filtered.filter(p => p.status === status);
    }
    if (packageType) {
        filtered = filtered.filter(p => p.packageType === packageType);
    }
    return filtered.filter(p => p.status === '0');
}
/** 获取套餐详情 */
export function getPackageById(packageId) {
    return mockPackages.find(p => p.packageId === packageId);
}
/** 新增套餐 */
export function createPackage(data) {
    const newPackage = {
        ...data,
        packageId: Math.max(...mockPackages.map(p => p.packageId)) + 1,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
    };
    mockPackages.push(newPackage);
    return newPackage;
}
/** 更新套餐 */
export function updatePackageById(packageId, data) {
    const index = mockPackages.findIndex(p => p.packageId === packageId);
    if (index === -1)
        return undefined;
    mockPackages[index] = {
        ...mockPackages[index],
        ...data,
        updateTime: new Date().toLocaleString('zh-CN'),
    };
    return mockPackages[index];
}
/** 删除套餐 */
export function deletePackageById(packageId) {
    const index = mockPackages.findIndex(p => p.packageId === packageId);
    if (index === -1)
        return false;
    mockPackages.splice(index, 1);
    return true;
}
//# sourceMappingURL=tenant-package.mock.js.map
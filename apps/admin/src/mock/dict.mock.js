/**
 * 数据字典 Mock 数据
 */
// ==================== 字典类型 Mock ====================
// 字典类型 Mock 数据
export const mockDictTypeList = [
    {
        dictId: 1,
        dictName: '用户性别',
        dictType: 'sys_user_sex',
        status: '0',
        remark: '用户性别字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 2,
        dictName: '菜单状态',
        dictType: 'sys_menu_status',
        status: '0',
        remark: '菜单状态字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 3,
        dictName: '系统开关',
        dictType: 'sys_yes_no',
        status: '0',
        remark: '系统开关字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 4,
        dictName: '任务状态',
        dictType: 'sys_job_status',
        status: '0',
        remark: '定时任务状态字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 5,
        dictName: '任务分组',
        dictType: 'sys_job_group',
        status: '0',
        remark: '定时任务分组字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 6,
        dictName: '公告类型',
        dictType: 'sys_notice_type',
        status: '0',
        remark: '通知公告类型字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 7,
        dictName: '业务状态',
        dictType: 'biz_status',
        status: '0',
        remark: '业务状态字典',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
    {
        dictId: 8,
        dictName: '订单状态',
        dictType: 'order_status',
        status: '1',
        remark: '订单状态字典（停用）',
        createTime: '2023-01-01 00:00:00',
        updateTime: '2023-01-01 00:00:00',
        createBy: 'admin',
    },
];
// 获取字典类型分页列表 Mock
export function getMockDictTypePage(params) {
    const { pageNum = 1, pageSize = 10, keyword = '', status = '' } = params;
    let filteredList = mockDictTypeList;
    if (keyword) {
        filteredList = filteredList.filter((item) => item.dictName.includes(keyword) || item.dictType.includes(keyword));
    }
    if (status) {
        filteredList = filteredList.filter((item) => item.status === status);
    }
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filteredList.slice(start, end);
    return {
        total: filteredList.length,
        rows,
    };
}
// 获取字典类型详情 Mock
export function getMockDictTypeDetail(dictId) {
    return mockDictTypeList.find((item) => item.dictId === dictId);
}
// 新增字典类型 Mock
export function addMockDictType(data) {
    const newItem = {
        dictId: Math.max(...mockDictTypeList.map((u) => u.dictId)) + 1,
        dictName: data.dictName || '',
        dictType: data.dictType || '',
        status: data.status || '0',
        remark: data.remark || '',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        createBy: 'admin',
    };
    mockDictTypeList.push(newItem);
    return newItem;
}
// 更新字典类型 Mock
export function updateMockDictType(dictId, data) {
    const index = mockDictTypeList.findIndex((u) => u.dictId === dictId);
    if (index !== -1) {
        mockDictTypeList[index] = { ...mockDictTypeList[index], ...data, updateTime: new Date().toLocaleString() };
        return mockDictTypeList[index];
    }
    return undefined;
}
// 删除字典类型 Mock
export function deleteMockDictType(dictId) {
    const index = mockDictTypeList.findIndex((u) => u.dictId === dictId);
    if (index !== -1) {
        mockDictTypeList.splice(index, 1);
        return true;
    }
    return false;
}
// ==================== 字典数据 Mock ====================
// 字典数据 Mock 数据
export const mockDictDataList = [
    // 用户性别
    { dictCode: 1, dictSort: 1, dictLabel: '男', dictValue: '0', dictType: 'sys_user_sex', listClass: 'primary', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 2, dictSort: 2, dictLabel: '女', dictValue: '1', dictType: 'sys_user_sex', listClass: 'danger', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 3, dictSort: 3, dictLabel: '未知', dictValue: '2', dictType: 'sys_user_sex', listClass: 'info', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    // 菜单状态
    { dictCode: 4, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_menu_status', listClass: 'success', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 5, dictSort: 2, dictLabel: '停用', dictValue: '1', dictType: 'sys_menu_status', listClass: 'danger', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    // 系统开关
    { dictCode: 6, dictSort: 1, dictLabel: '是', dictValue: 'Y', dictType: 'sys_yes_no', listClass: 'success', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 7, dictSort: 2, dictLabel: '否', dictValue: 'N', dictType: 'sys_yes_no', listClass: 'danger', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    // 任务状态
    { dictCode: 8, dictSort: 1, dictLabel: '正常', dictValue: '0', dictType: 'sys_job_status', listClass: 'success', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 9, dictSort: 2, dictLabel: '暂停', dictValue: '1', dictType: 'sys_job_status', listClass: 'warning', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    // 任务分组
    { dictCode: 10, dictSort: 1, dictLabel: '默认', dictValue: 'default', dictType: 'sys_job_group', listClass: 'default', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 11, dictSort: 2, dictLabel: '系统', dictValue: 'system', dictType: 'sys_job_group', listClass: 'primary', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    // 公告类型
    { dictCode: 12, dictSort: 1, dictLabel: '通知', dictValue: '1', dictType: 'sys_notice_type', listClass: 'primary', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 13, dictSort: 2, dictLabel: '公告', dictValue: '2', dictType: 'sys_notice_type', listClass: 'info', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    // 业务状态
    { dictCode: 14, dictSort: 1, dictLabel: '待处理', dictValue: 'pending', dictType: 'biz_status', listClass: 'warning', isDefault: '1', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 15, dictSort: 2, dictLabel: '处理中', dictValue: 'processing', dictType: 'biz_status', listClass: 'primary', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 16, dictSort: 3, dictLabel: '已完成', dictValue: 'completed', dictType: 'biz_status', listClass: 'success', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
    { dictCode: 17, dictSort: 4, dictLabel: '已取消', dictValue: 'cancelled', dictType: 'biz_status', listClass: 'info', isDefault: '0', status: '0', createTime: '2023-01-01 00:00:00', updateTime: '2023-01-01 00:00:00' },
];
// 获取字典数据分页列表 Mock
export function getMockDictDataPage(params) {
    const { pageNum = 1, pageSize = 10, keyword = '', dictType = '', status = '' } = params;
    let filteredList = mockDictDataList;
    if (keyword) {
        filteredList = filteredList.filter((item) => item.dictLabel.includes(keyword) || item.dictValue.includes(keyword));
    }
    if (dictType) {
        filteredList = filteredList.filter((item) => item.dictType === dictType);
    }
    if (status) {
        filteredList = filteredList.filter((item) => item.status === status);
    }
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filteredList.slice(start, end);
    return {
        total: filteredList.length,
        rows,
    };
}
// 根据类型获取字典数据 Mock
export function getMockDictDataByType(dictType) {
    return mockDictDataList.filter((item) => item.dictType === dictType && item.status === '0');
}
// 获取字典数据详情 Mock
export function getMockDictDataDetail(dictCode) {
    return mockDictDataList.find((item) => item.dictCode === dictCode);
}
// 新增字典数据 Mock
export function addMockDictData(data) {
    const newItem = {
        dictCode: Math.max(...mockDictDataList.map((u) => u.dictCode)) + 1,
        dictSort: data.dictSort || 0,
        dictLabel: data.dictLabel || '',
        dictValue: data.dictValue || '',
        dictType: data.dictType || '',
        cssClass: data.cssClass || '',
        listClass: data.listClass || 'default',
        isDefault: data.isDefault || '0',
        status: data.status || '0',
        remark: data.remark || '',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
    };
    mockDictDataList.push(newItem);
    return newItem;
}
// 更新字典数据 Mock
export function updateMockDictData(dictCode, data) {
    const index = mockDictDataList.findIndex((u) => u.dictCode === dictCode);
    if (index !== -1) {
        mockDictDataList[index] = { ...mockDictDataList[index], ...data, updateTime: new Date().toLocaleString() };
        return mockDictDataList[index];
    }
    return undefined;
}
// 删除字典数据 Mock
export function deleteMockDictData(dictCode) {
    const index = mockDictDataList.findIndex((u) => u.dictCode === dictCode);
    if (index !== -1) {
        mockDictDataList.splice(index, 1);
        return true;
    }
    return false;
}
//# sourceMappingURL=dict.mock.js.map
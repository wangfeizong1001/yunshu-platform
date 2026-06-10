/**
 * 报表 Mock 数据
 */
// 生成 Mock 报表数据
export const mockReportList = [
    {
        reportId: 1,
        reportName: '销售数据统计',
        reportCode: 'SALES_STATISTICS',
        reportType: 'chart',
        description: '各部门月度销售数据统计分析',
        config: JSON.stringify({
            title: '销售数据统计',
            chartType: 'line',
            xAxis: '月份',
            yAxis: '销售额(万元)',
            data: [
                { month: '1月', sales: 120, target: 100 },
                { month: '2月', sales: 132, target: 110 },
                { month: '3月', sales: 101, target: 105 },
                { month: '4月', sales: 134, target: 120 },
                { month: '5月', sales: 90, target: 100 },
                { month: '6月', sales: 230, target: 180 }
            ]
        }),
        status: '0',
        createTime: '2024-01-15 10:30:00',
        updateTime: '2024-01-20 14:20:00',
        createBy: 'admin',
        remark: '用于销售部门月度分析'
    },
    {
        reportId: 2,
        reportName: '用户增长分析',
        reportCode: 'USER_GROWTH',
        reportType: 'chart',
        description: '用户注册和增长趋势分析',
        config: JSON.stringify({
            title: '用户增长分析',
            chartType: 'bar',
            xAxis: '日期',
            yAxis: '用户数',
            data: [
                { date: '周一', newUsers: 120, activeUsers: 800 },
                { date: '周二', newUsers: 132, activeUsers: 850 },
                { date: '周三', newUsers: 101, activeUsers: 780 },
                { date: '周四', newUsers: 134, activeUsers: 900 },
                { date: '周五', newUsers: 90, activeUsers: 920 },
                { date: '周六', newUsers: 230, activeUsers: 1200 },
                { date: '周日', newUsers: 210, activeUsers: 1150 }
            ]
        }),
        status: '0',
        createTime: '2024-01-10 09:15:00',
        updateTime: '2024-01-18 16:45:00',
        createBy: 'admin',
        remark: '产品部门关注指标'
    },
    {
        reportId: 3,
        reportName: '部门人员统计',
        reportCode: 'DEPT_STATISTICS',
        reportType: 'table',
        description: '各部门人员数量统计报表',
        config: JSON.stringify({
            title: '部门人员统计',
            columns: [
                { field: 'deptName', title: '部门名称', width: 200 },
                { field: 'totalCount', title: '总人数', width: 100 },
                { field: 'maleCount', title: '男性', width: 100 },
                { field: 'femaleCount', title: '女性', width: 100 },
                { field: 'avgAge', title: '平均年龄', width: 120 }
            ],
            data: [
                { deptName: '技术部', totalCount: 45, maleCount: 35, femaleCount: 10, avgAge: 28 },
                { deptName: '产品部', totalCount: 12, maleCount: 6, femaleCount: 6, avgAge: 26 },
                { deptName: '设计部', totalCount: 8, maleCount: 2, femaleCount: 6, avgAge: 25 },
                { deptName: '市场部', totalCount: 20, maleCount: 10, femaleCount: 10, avgAge: 27 },
                { deptName: '财务部', totalCount: 6, maleCount: 2, femaleCount: 4, avgAge: 30 }
            ]
        }),
        status: '0',
        createTime: '2024-01-05 11:20:00',
        updateTime: '2024-01-15 09:30:00',
        createBy: 'admin',
        remark: '人力资源统计'
    },
    {
        reportId: 4,
        reportName: '订单收入分析',
        reportCode: 'ORDER_INCOME',
        reportType: 'chart',
        description: '订单收入趋势和占比分析',
        config: JSON.stringify({
            title: '订单收入分析',
            chartType: 'pie',
            data: [
                { category: '电子产品', value: 1048 },
                { category: '服装', value: 735 },
                { category: '食品', value: 580 },
                { category: '家居', value: 484 },
                { category: '其他', value: 300 }
            ]
        }),
        status: '1',
        createTime: '2024-01-08 15:40:00',
        updateTime: '2024-01-12 10:15:00',
        createBy: 'admin',
        remark: '待审核'
    }
];
// 获取报表分页列表 Mock
export function getMockReportPage(params) {
    const { pageNum = 1, pageSize = 10, reportName = '', reportType = '', status = '' } = params;
    let filteredList = mockReportList;
    // 报表名称过滤
    if (reportName) {
        filteredList = filteredList.filter((report) => report.reportName.includes(reportName));
    }
    // 报表类型过滤
    if (reportType) {
        filteredList = filteredList.filter((report) => report.reportType === reportType);
    }
    // 状态过滤
    if (status) {
        filteredList = filteredList.filter((report) => report.status === status);
    }
    // 分页
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const rows = filteredList.slice(start, end);
    return {
        total: filteredList.length,
        rows
    };
}
// 获取报表详情 Mock
export function getMockReportDetail(reportId) {
    return mockReportList.find((report) => report.reportId === reportId);
}
// 新增报表 Mock
export function addMockReport(report) {
    const newReport = {
        reportId: Math.max(...mockReportList.map((r) => r.reportId)) + 1,
        reportName: report.reportName || '',
        reportCode: report.reportCode || '',
        reportType: report.reportType || 'chart',
        description: report.description || '',
        config: report.config || '',
        status: report.status || '0',
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        createBy: 'admin',
        remark: report.remark || ''
    };
    mockReportList.push(newReport);
    return newReport;
}
// 更新报表 Mock
export function updateMockReport(reportId, report) {
    const index = mockReportList.findIndex((r) => r.reportId === reportId);
    if (index !== -1) {
        mockReportList[index] = { ...mockReportList[index], ...report, updateTime: new Date().toLocaleString() };
        return mockReportList[index];
    }
    return undefined;
}
// 删除报表 Mock
export function deleteMockReport(reportId) {
    const index = mockReportList.findIndex((r) => r.reportId === reportId);
    if (index !== -1) {
        mockReportList.splice(index, 1);
        return true;
    }
    return false;
}
// 获取报表数据 Mock
export function getMockReportData(reportId) {
    const report = mockReportList.find((r) => r.reportId === reportId);
    if (report) {
        try {
            return JSON.parse(report.config);
        }
        catch {
            return null;
        }
    }
    return null;
}
//# sourceMappingURL=report.mock.js.map
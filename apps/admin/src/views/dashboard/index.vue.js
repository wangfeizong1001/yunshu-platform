import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import dayjs from 'dayjs';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, VisualMapComponent, } from 'echarts/components';
import { Calendar, Sunny, Moon, CaretTop, CaretBottom, TrendCharts, User, Key, UserFilled, Connection, DataAnalysis, PieChart as PieChartIcon, Monitor, Histogram, MagicStick, Document, Lock, Cpu, ArrowRight, } from '@element-plus/icons-vue';
import { getDashboardOverview, getUserGrowthTrend, getOperationTypeDistribution, getSystemResourceTrend, getLoginDistribution, getTaskStats, } from '@/api/admin-dashboard.api';
import { request } from '@/utils/httpClient';
import { getOperlogPage } from '@/api/monitor/operlog.api';
// ========== 常量配置 ==========
// 操作日志 status 字段值常量（与后端约定）
const OPERLOG_STATUS_SUCCESS = '0';
const OPERLOG_STATUS_FAIL = '1';
// 操作类型 -> Element Plus tag 类型的映射（扩展版，命中不到时回退到 info）
const OPER_TYPE_TAG_MAP = {
    查询: 'info',
    新增: 'success',
    创建: 'success',
    修改: 'warning',
    更新: 'warning',
    删除: 'danger',
    导出: 'primary',
    导入: 'primary',
    登录: 'success',
    登出: 'info',
    重置密码: 'warning',
};
// 图表主题色 —— 统一定义，便于未来主题切换
const CHART_THEME = {
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
    muted: '#606266',
    tooltipBg: 'rgba(255, 255, 255, 0.95)',
    border: '#e4e7ed',
    text: '#303133',
    textMuted: '#606266',
    labelMuted: '#909399',
    splitLine: '#f0f2f5',
};
// 注册 ECharts 组件
use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    VisualMapComponent,
]);
const router = useRouter();
const userStore = useUserStore();
// ========== 时间相关 ==========
const currentDateTime = ref('');
let clockTimer;
const greetingText = computed(() => {
    const hour = new Date().getHours();
    if (hour < 6)
        return '夜深了';
    if (hour < 9)
        return '早上好';
    if (hour < 12)
        return '上午好';
    if (hour < 14)
        return '中午好';
    if (hour < 18)
        return '下午好';
    if (hour < 22)
        return '晚上好';
    return '夜深了';
});
const isDaytime = computed(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
});
const updateDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];
    currentDateTime.value = `${year}年${month}月${day}日 ${weekDay} ${hours}:${minutes}:${seconds}`;
};
// ========== 数据相关 ==========
const overview = reactive({
    userCount: 0,
    roleCount: 0,
    onlineCount: 0,
    todayVisit: 0,
    userGrowth: 0,
    roleGrowth: 0,
    onlineGrowth: 0,
    visitGrowth: 0,
});
const userGrowthData = ref([]);
const operationTypeData = ref([]);
const systemResourceData = ref([]);
const loginDistributionData = ref([]);
const taskStats = ref({
    totalCount: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalGrowth: 0,
    completedGrowth: 0,
    inProgressGrowth: 0,
});
const serverInfo = ref({
    serverName: '云枢生产服务器',
    os: '',
    osArch: '',
    cpuCount: 0,
    cpuUsage: 35,
    memoryUsed: 0,
    memoryTotal: 0,
    memoryUsage: 40,
    diskUsed: 0,
    diskTotal: 0,
    diskUsage: 50,
    bootTime: '',
    uptime: 0,
    jvm: '',
    javaVersion: '',
    database: '',
    databaseVersion: '',
    projectPath: '',
    hostName: '',
    collectTime: '',
});
const operLogs = ref([]);
const growthTrendType = ref('activeUsers');
// 请求取消控制器 —— 离开页面时中断未完成请求
const abortController = new AbortController();
let pollingTimer;
// ========== 快捷统计 ==========
const quickStats = computed(() => [
    {
        label: '今日任务',
        value: String(taskStats.value.totalCount),
        trend: taskStats.value.totalGrowth,
    },
    {
        label: '已完成',
        value: String(taskStats.value.completedCount),
        trend: taskStats.value.completedGrowth,
    },
    {
        label: '进行中',
        value: String(taskStats.value.inProgressCount),
        trend: taskStats.value.inProgressGrowth,
    },
]);
// ========== 统计卡片配置（图标现在是真正的组件引用，不再是字符串） ==========
const statCards = [
    { key: 'userCount', growthKey: 'userGrowth', label: '用户总数', icon: User, color: CHART_THEME.primary },
    { key: 'roleCount', growthKey: 'roleGrowth', label: '角色总数', icon: Key, color: CHART_THEME.success },
    { key: 'onlineCount', growthKey: 'onlineGrowth', label: '在线人数', icon: UserFilled, color: CHART_THEME.warning },
    { key: 'todayVisit', growthKey: 'visitGrowth', label: '今日访问', icon: Connection, color: CHART_THEME.danger },
];
// ========== 快捷入口 ==========
const quickEntries = [
    { title: '用户管理', path: '/system/user', icon: User, color: CHART_THEME.primary },
    { title: '角色管理', path: '/system/role', icon: Key, color: CHART_THEME.success },
    { title: '菜单管理', path: '/system/menu', icon: MagicStick, color: CHART_THEME.warning },
    { title: '系统监控', path: '/monitor/server', icon: Monitor, color: CHART_THEME.danger },
    { title: '操作日志', path: '/monitor/operlog', icon: Document, color: CHART_THEME.info },
    { title: '登录日志', path: '/monitor/logininfor', icon: Lock, color: CHART_THEME.muted },
];
// ========== 图表配置 ==========
// 用户增长趋势图 —— 根据 growthTrendType 高亮对应系列
const userGrowthChartOption = computed(() => {
    const dates = userGrowthData.value.map((d) => dayjs(d.date).format('MM-DD'));
    const extract = (key) => userGrowthData.value.map((d) => d[key]);
    // 高亮当前选中的类型：线宽增大、symbol 增大
    const buildSeries = (name, key, color) => {
        const isActive = growthTrendType.value === key;
        return {
            name,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: isActive ? 10 : 6,
            data: extract(key),
            lineStyle: { width: isActive ? 3 : 2, color, opacity: isActive ? 1 : 0.65 },
            itemStyle: { color, opacity: isActive ? 1 : 0.65 },
            areaStyle: {
                opacity: isActive ? 1 : 0.35,
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: `${color}4D` },
                        { offset: 1, color: `${color}0D` },
                    ],
                },
            },
        };
    };
    return {
        tooltip: {
            trigger: 'axis',
            backgroundColor: CHART_THEME.tooltipBg,
            borderColor: CHART_THEME.border,
            borderWidth: 1,
            textStyle: { color: CHART_THEME.text },
        },
        legend: {
            data: ['新增用户', '活跃用户', '登录次数'],
            bottom: 0,
            textStyle: { color: CHART_THEME.textMuted },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLine: { lineStyle: { color: CHART_THEME.border } },
            axisLabel: { color: CHART_THEME.labelMuted },
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
            axisLabel: { color: CHART_THEME.labelMuted },
        },
        series: [
            buildSeries('新增用户', 'newUsers', CHART_THEME.primary),
            buildSeries('活跃用户', 'activeUsers', CHART_THEME.success),
            buildSeries('登录次数', 'logins', CHART_THEME.warning),
        ],
    };
});
// 操作类型分布图（环形饼图）
const operationTypeChartOption = computed(() => {
    const colors = [
        CHART_THEME.primary,
        CHART_THEME.success,
        CHART_THEME.warning,
        CHART_THEME.danger,
        CHART_THEME.info,
        CHART_THEME.muted,
    ];
    return {
        tooltip: {
            trigger: 'item',
            backgroundColor: CHART_THEME.tooltipBg,
            borderColor: CHART_THEME.border,
            borderWidth: 1,
            textStyle: { color: CHART_THEME.text },
            formatter: '{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            textStyle: { color: CHART_THEME.textMuted },
            itemWidth: 12,
            itemHeight: 12,
            icon: 'circle',
        },
        color: colors,
        series: [
            {
                name: '操作类型',
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                emphasis: {
                    label: { show: true, fontSize: 14, fontWeight: 'bold', formatter: '{b}\n{d}%' },
                    itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.2)' },
                },
                labelLine: { show: false },
                data: operationTypeData.value.map((item) => ({
                    value: item.value,
                    name: item.name,
                })),
            },
        ],
    };
});
// 系统资源使用趋势图
const resourceChartOption = computed(() => {
    const times = systemResourceData.value.map((d) => d.time);
    const cpuData = systemResourceData.value.map((d) => d.cpu);
    const memoryData = systemResourceData.value.map((d) => d.memory);
    const diskData = systemResourceData.value.map((d) => d.disk);
    const buildLine = (name, data, color) => ({
        name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data,
        lineStyle: { width: 2, color },
        itemStyle: { color },
    });
    return {
        tooltip: {
            trigger: 'axis',
            backgroundColor: CHART_THEME.tooltipBg,
            borderColor: CHART_THEME.border,
            borderWidth: 1,
            textStyle: { color: CHART_THEME.text },
            formatter: (params) => {
                const list = params;
                const axisValue = list[0]?.axisValueLabel ?? list[0]?.axisValue ?? '';
                let html = `<div style="font-weight:600;margin-bottom:4px">${axisValue}</div>`;
                list.forEach((p) => {
                    html += `<div style="display:flex;align-items:center;gap:8px;margin:2px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
            <span>${p.seriesName}: ${p.value}%</span>
          </div>`;
                });
                return html;
            },
        },
        legend: {
            data: ['CPU', '内存', '磁盘'],
            bottom: 0,
            textStyle: { color: CHART_THEME.textMuted },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: times,
            axisLine: { lineStyle: { color: CHART_THEME.border } },
            axisLabel: { color: CHART_THEME.labelMuted },
        },
        yAxis: {
            type: 'value',
            max: 100,
            splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
            axisLabel: { color: CHART_THEME.labelMuted, formatter: '{value}%' },
        },
        series: [
            buildLine('CPU', cpuData, CHART_THEME.primary),
            buildLine('内存', memoryData, CHART_THEME.success),
            buildLine('磁盘', diskData, CHART_THEME.warning),
        ],
    };
});
// 登录时间分布图（柱状图）
const loginDistributionChartOption = computed(() => {
    const hours = loginDistributionData.value.map((d) => `${d.hour}:00`);
    const counts = loginDistributionData.value.map((d) => d.count);
    return {
        tooltip: {
            trigger: 'axis',
            backgroundColor: CHART_THEME.tooltipBg,
            borderColor: CHART_THEME.border,
            borderWidth: 1,
            textStyle: { color: CHART_THEME.text },
            axisPointer: { type: 'shadow' },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLine: { lineStyle: { color: CHART_THEME.border } },
            axisLabel: { color: CHART_THEME.labelMuted, interval: 2, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: CHART_THEME.splitLine } },
            axisLabel: { color: CHART_THEME.labelMuted },
        },
        series: [
            {
                name: '登录次数',
                type: 'bar',
                barWidth: '55%',
                data: counts,
                itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#79bbff' },
                            { offset: 1, color: CHART_THEME.primary },
                        ],
                    },
                },
                emphasis: {
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#a0cfff' },
                                { offset: 1, color: '#66b1ff' },
                            ],
                        },
                    },
                },
            },
        ],
    };
});
// ========== 工具函数 ==========
/** 数字格式化：>= 1 万显示 x.xw；其他按千分位显示。 */
const formatNumber = (num) => {
    const n = Number(num) || 0;
    if (n >= 10000) {
        return `${(n / 10000).toFixed(1)}w`;
    }
    return n.toLocaleString('zh-CN');
};
/** 时间格式化：解析 ISO/任意时间字符串，按 "YYYY-MM-DD HH:mm" 输出。 */
const formatTime = (time) => {
    if (!time)
        return '-';
    const d = dayjs(time);
    if (!d.isValid())
        return String(time);
    return d.format('YYYY-MM-DD HH:mm');
};
/** 进度条颜色：安全归一化 percentage 值。 */
const getProgressColor = (percentage) => {
    const p = Number(percentage) || 0;
    if (p < 60)
        return CHART_THEME.success;
    if (p < 80)
        return CHART_THEME.warning;
    return CHART_THEME.danger;
};
/** 操作类型 -> tag 类型（兜底为 info）。 */
const getOperTypeTagType = (type) => {
    if (!type)
        return 'info';
    return OPER_TYPE_TAG_MAP[type] || 'info';
};
/** 操作日志状态文本。 */
const getStatusText = (status) => {
    const s = typeof status === 'number' ? String(status) : status;
    return s === OPERLOG_STATUS_SUCCESS ? '成功' : '失败';
};
/** 操作日志状态 tag 类型。 */
const getStatusTagType = (status) => {
    const s = typeof status === 'number' ? String(status) : status;
    return s === OPERLOG_STATUS_SUCCESS ? 'success' : 'danger';
};
const handleQuickEntry = (path) => {
    router.push(path);
};
// ========== 数据加载（带类型安全 + 错误上报 + 默认数据兜底） ==========
const DEFAULT_OVERVIEW = {
    userCount: 128,
    roleCount: 8,
    onlineCount: 12,
    todayVisit: 1523,
    userGrowth: 12.5,
    roleGrowth: 3.2,
    onlineGrowth: -2.1,
    visitGrowth: 8.6,
};
const DEFAULT_TASK_STATS = {
    totalCount: 15,
    completedCount: 8,
    inProgressCount: 5,
    totalGrowth: 12.5,
    completedGrowth: 8.3,
    inProgressGrowth: -2.1,
};
function pickData(resp) {
    return resp && resp.success && resp.data !== undefined && resp.data !== null
        ? resp.data
        : undefined;
}
const fetchOverview = async () => {
    try {
        const res = await getDashboardOverview();
        const data = pickData(res) ?? DEFAULT_OVERVIEW;
        Object.assign(overview, data);
    }
    catch (err) {
        console.error('[dashboard] fetchOverview failed:', err);
        Object.assign(overview, DEFAULT_OVERVIEW);
    }
};
const fetchUserGrowth = async () => {
    try {
        const res = await getUserGrowthTrend();
        const data = pickData(res);
        if (data && data.length) {
            userGrowthData.value = data;
        }
    }
    catch (err) {
        console.error('[dashboard] fetchUserGrowth failed:', err);
    }
};
const fetchOperationType = async () => {
    try {
        const res = await getOperationTypeDistribution();
        const data = pickData(res);
        if (data && data.length) {
            operationTypeData.value = data;
        }
    }
    catch (err) {
        console.error('[dashboard] fetchOperationType failed:', err);
    }
};
const fetchSystemResource = async () => {
    try {
        const res = await getSystemResourceTrend();
        const data = pickData(res);
        if (data && data.length) {
            systemResourceData.value = data;
        }
    }
    catch (err) {
        console.error('[dashboard] fetchSystemResource failed:', err);
    }
};
const fetchLoginDistribution = async () => {
    try {
        const res = await getLoginDistribution();
        const data = pickData(res);
        if (data && data.length) {
            loginDistributionData.value = data;
        }
    }
    catch (err) {
        console.error('[dashboard] fetchLoginDistribution failed:', err);
    }
};
const fetchTaskStats = async () => {
    try {
        const res = await getTaskStats();
        const data = pickData(res) ?? DEFAULT_TASK_STATS;
        Object.assign(taskStats.value, data);
    }
    catch (err) {
        console.error('[dashboard] fetchTaskStats failed:', err);
        Object.assign(taskStats.value, DEFAULT_TASK_STATS);
    }
};
const fetchServerInfo = async () => {
    try {
        // 走统一 request 接口，/api/admin-dashboard/server-info 返回 IServer
        const res = await request({
            url: '/api/admin-dashboard/server-info',
            method: 'GET',
        });
        const data = pickData(res);
        if (data) {
            serverInfo.value = { ...serverInfo.value, ...data };
        }
    }
    catch (err) {
        console.error('[dashboard] fetchServerInfo failed:', err);
    }
};
const fetchOperLogs = async () => {
    try {
        const res = await getOperlogPage({ pageNum: 1, pageSize: 10 });
        // 兼容 rows 直接存在或嵌套在 data 下两种契约
        const maybeRows = res.rows
            ?? res.data?.rows;
        if (Array.isArray(maybeRows)) {
            operLogs.value = maybeRows;
        }
    }
    catch (err) {
        console.error('[dashboard] fetchOperLogs failed:', err);
    }
};
// 一次性加载所有仪表盘数据
const loadAll = () => {
    fetchOverview();
    fetchUserGrowth();
    fetchOperationType();
    fetchSystemResource();
    fetchLoginDistribution();
    fetchTaskStats();
    fetchServerInfo();
    fetchOperLogs();
};
onMounted(() => {
    updateDateTime();
    clockTimer = setInterval(updateDateTime, 1000);
    loadAll();
    // 每 30 秒轮询一次"实时性较强"的数据：在线人数 / 系统资源 / 任务统计
    pollingTimer = setInterval(() => {
        if (document.hidden)
            return;
        fetchOverview();
        fetchSystemResource();
        fetchTaskStats();
    }, 30_000);
});
onUnmounted(() => {
    if (clockTimer)
        clearInterval(clockTimer);
    if (pollingTimer)
        clearInterval(pollingTimer);
    try {
        abortController.abort();
    }
    catch {
        /* noop */
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['up']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "dashboard" },
});
const __VLS_0 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    gutter: (16),
    ...{ class: "welcome-section" },
}));
const __VLS_2 = __VLS_1({
    gutter: (16),
    ...{ class: "welcome-section" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    span: (24),
}));
const __VLS_6 = __VLS_5({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "welcome-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "welcome-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "greeting" },
});
(__VLS_ctx.greetingText);
(__VLS_ctx.userStore.nickname || __VLS_ctx.userStore.username);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "date-time" },
});
const __VLS_8 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.Calendar;
/** @type {[typeof __VLS_components.Calendar, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
var __VLS_11;
(__VLS_ctx.currentDateTime);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "separator" },
});
const __VLS_16 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
if (__VLS_ctx.isDaytime) {
    const __VLS_20 = {}.Sunny;
    /** @type {[typeof __VLS_components.Sunny, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
}
else {
    const __VLS_24 = {}.Moon;
    /** @type {[typeof __VLS_components.Moon, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
}
var __VLS_19;
(__VLS_ctx.isDaytime ? '白天' : '夜晚');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "welcome-right" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.quickStats))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "quick-stat" },
        key: (item.label),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "stat-label" },
    });
    (item.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "stat-value" },
    });
    (item.value);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "stat-trend" },
        ...{ class: (item.trend >= 0 ? 'up' : 'down') },
    });
    const __VLS_28 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({}));
    const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
    __VLS_31.slots.default;
    if (item.trend >= 0) {
        const __VLS_32 = {}.CaretTop;
        /** @type {[typeof __VLS_components.CaretTop, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
        const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
    }
    else {
        const __VLS_36 = {}.CaretBottom;
        /** @type {[typeof __VLS_components.CaretBottom, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
        const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
    }
    var __VLS_31;
    (Math.abs(item.trend));
}
var __VLS_7;
var __VLS_3;
const __VLS_40 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    gutter: (16),
    ...{ class: "stat-section" },
}));
const __VLS_42 = __VLS_41({
    gutter: (16),
    ...{ class: "stat-section" },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
for (const [card, idx] of __VLS_getVForSourceType((__VLS_ctx.statCards))) {
    const __VLS_44 = {}.ElCol;
    /** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
        xs: (24),
        sm: (12),
        md: (6),
        key: (card.key),
    }));
    const __VLS_46 = __VLS_45({
        xs: (24),
        sm: (12),
        md: (6),
        key: (card.key),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    __VLS_47.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-card" },
        ...{ style: ({ '--card-color': card.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-icon" },
    });
    const __VLS_48 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        size: (28),
    }));
    const __VLS_50 = __VLS_49({
        size: (28),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    __VLS_51.slots.default;
    const __VLS_52 = ((card.icon));
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    var __VLS_51;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-info" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-value" },
    });
    (__VLS_ctx.formatNumber(__VLS_ctx.overview[card.key] || 0));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-label" },
    });
    (card.label);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "stat-trend" },
        ...{ class: (__VLS_ctx.overview[card.growthKey] >= 0 ? 'up' : 'down') },
    });
    const __VLS_56 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({}));
    const __VLS_58 = __VLS_57({}, ...__VLS_functionalComponentArgsRest(__VLS_57));
    __VLS_59.slots.default;
    const __VLS_60 = {}.TrendCharts;
    /** @type {[typeof __VLS_components.TrendCharts, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
    const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
    var __VLS_59;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.overview[card.growthKey] >= 0 ? '+' : '');
    (__VLS_ctx.overview[card.growthKey]);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "trend-label" },
    });
    var __VLS_47;
}
var __VLS_43;
const __VLS_64 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    gutter: (16),
    ...{ class: "chart-section" },
}));
const __VLS_66 = __VLS_65({
    gutter: (16),
    ...{ class: "chart-section" },
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    xs: (24),
    lg: (14),
}));
const __VLS_70 = __VLS_69({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_71.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
const __VLS_72 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
const __VLS_76 = {}.DataAnalysis;
/** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({}));
const __VLS_78 = __VLS_77({}, ...__VLS_functionalComponentArgsRest(__VLS_77));
var __VLS_75;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-tabs" },
});
const __VLS_80 = {}.ElRadioGroup;
/** @type {[typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, typeof __VLS_components.ElRadioGroup, typeof __VLS_components.elRadioGroup, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    modelValue: (__VLS_ctx.growthTrendType),
    size: "small",
}));
const __VLS_82 = __VLS_81({
    modelValue: (__VLS_ctx.growthTrendType),
    size: "small",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
const __VLS_84 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
    value: "newUsers",
}));
const __VLS_86 = __VLS_85({
    value: "newUsers",
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
__VLS_87.slots.default;
var __VLS_87;
const __VLS_88 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
    value: "activeUsers",
}));
const __VLS_90 = __VLS_89({
    value: "activeUsers",
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
__VLS_91.slots.default;
var __VLS_91;
const __VLS_92 = {}.ElRadioButton;
/** @type {[typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, typeof __VLS_components.ElRadioButton, typeof __VLS_components.elRadioButton, ]} */ ;
// @ts-ignore
const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
    value: "logins",
}));
const __VLS_94 = __VLS_93({
    value: "logins",
}, ...__VLS_functionalComponentArgsRest(__VLS_93));
__VLS_95.slots.default;
var __VLS_95;
var __VLS_83;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-body" },
});
const __VLS_96 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
    ...{ class: "chart" },
    option: (__VLS_ctx.userGrowthChartOption),
    autoresize: true,
}));
const __VLS_98 = __VLS_97({
    ...{ class: "chart" },
    option: (__VLS_ctx.userGrowthChartOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
var __VLS_71;
const __VLS_100 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
    xs: (24),
    lg: (10),
}));
const __VLS_102 = __VLS_101({
    xs: (24),
    lg: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
__VLS_103.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
const __VLS_104 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({}));
const __VLS_106 = __VLS_105({}, ...__VLS_functionalComponentArgsRest(__VLS_105));
__VLS_107.slots.default;
const __VLS_108 = ((__VLS_ctx.PieChartIcon));
// @ts-ignore
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({}));
const __VLS_110 = __VLS_109({}, ...__VLS_functionalComponentArgsRest(__VLS_109));
var __VLS_107;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-body" },
});
const __VLS_112 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
    ...{ class: "chart" },
    option: (__VLS_ctx.operationTypeChartOption),
    autoresize: true,
}));
const __VLS_114 = __VLS_113({
    ...{ class: "chart" },
    option: (__VLS_ctx.operationTypeChartOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
var __VLS_103;
var __VLS_67;
const __VLS_116 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
    gutter: (16),
    ...{ class: "chart-section" },
}));
const __VLS_118 = __VLS_117({
    gutter: (16),
    ...{ class: "chart-section" },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
__VLS_119.slots.default;
const __VLS_120 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
    xs: (24),
    lg: (14),
}));
const __VLS_122 = __VLS_121({
    xs: (24),
    lg: (14),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
__VLS_123.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
const __VLS_124 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({}));
const __VLS_126 = __VLS_125({}, ...__VLS_functionalComponentArgsRest(__VLS_125));
__VLS_127.slots.default;
const __VLS_128 = {}.Monitor;
/** @type {[typeof __VLS_components.Monitor, ]} */ ;
// @ts-ignore
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({}));
const __VLS_130 = __VLS_129({}, ...__VLS_functionalComponentArgsRest(__VLS_129));
var __VLS_127;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-body" },
});
const __VLS_132 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
    ...{ class: "chart" },
    option: (__VLS_ctx.resourceChartOption),
    autoresize: true,
}));
const __VLS_134 = __VLS_133({
    ...{ class: "chart" },
    option: (__VLS_ctx.resourceChartOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
var __VLS_123;
const __VLS_136 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
    xs: (24),
    lg: (10),
}));
const __VLS_138 = __VLS_137({
    xs: (24),
    lg: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_137));
__VLS_139.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-title" },
});
const __VLS_140 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({}));
const __VLS_142 = __VLS_141({}, ...__VLS_functionalComponentArgsRest(__VLS_141));
__VLS_143.slots.default;
const __VLS_144 = {}.Histogram;
/** @type {[typeof __VLS_components.Histogram, ]} */ ;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({}));
const __VLS_146 = __VLS_145({}, ...__VLS_functionalComponentArgsRest(__VLS_145));
var __VLS_143;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-body" },
});
const __VLS_148 = {}.VChart;
/** @type {[typeof __VLS_components.VChart, typeof __VLS_components.vChart, ]} */ ;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
    ...{ class: "chart" },
    option: (__VLS_ctx.loginDistributionChartOption),
    autoresize: true,
}));
const __VLS_150 = __VLS_149({
    ...{ class: "chart" },
    option: (__VLS_ctx.loginDistributionChartOption),
    autoresize: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
var __VLS_139;
var __VLS_119;
const __VLS_152 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
    gutter: (16),
    ...{ class: "content-section" },
}));
const __VLS_154 = __VLS_153({
    gutter: (16),
    ...{ class: "content-section" },
}, ...__VLS_functionalComponentArgsRest(__VLS_153));
__VLS_155.slots.default;
const __VLS_156 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_157 = __VLS_asFunctionalComponent(__VLS_156, new __VLS_156({
    xs: (24),
    lg: (8),
}));
const __VLS_158 = __VLS_157({
    xs: (24),
    lg: (8),
}, ...__VLS_functionalComponentArgsRest(__VLS_157));
__VLS_159.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-header" },
});
const __VLS_160 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({}));
const __VLS_162 = __VLS_161({}, ...__VLS_functionalComponentArgsRest(__VLS_161));
__VLS_163.slots.default;
const __VLS_164 = {}.MagicStick;
/** @type {[typeof __VLS_components.MagicStick, ]} */ ;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent(__VLS_164, new __VLS_164({}));
const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
var __VLS_163;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "quick-entry" },
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.quickEntries))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleQuickEntry(item.path);
            } },
        key: (item.path),
        ...{ class: "quick-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "quick-icon" },
        ...{ style: ({ backgroundColor: item.color }) },
    });
    const __VLS_168 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
        size: (20),
    }));
    const __VLS_170 = __VLS_169({
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    __VLS_171.slots.default;
    const __VLS_172 = ((item.icon));
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({}));
    const __VLS_174 = __VLS_173({}, ...__VLS_functionalComponentArgsRest(__VLS_173));
    var __VLS_171;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "quick-title" },
    });
    (item.title);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-header" },
});
const __VLS_176 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({}));
const __VLS_178 = __VLS_177({}, ...__VLS_functionalComponentArgsRest(__VLS_177));
__VLS_179.slots.default;
const __VLS_180 = {}.Cpu;
/** @type {[typeof __VLS_components.Cpu, ]} */ ;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({}));
const __VLS_182 = __VLS_181({}, ...__VLS_functionalComponentArgsRest(__VLS_181));
var __VLS_179;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "status-badge up" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-bar" },
});
const __VLS_184 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
    percentage: (Number(__VLS_ctx.serverInfo.cpuUsage) || 0),
    strokeWidth: (8),
    color: (__VLS_ctx.getProgressColor(__VLS_ctx.serverInfo.cpuUsage)),
    showText: (false),
}));
const __VLS_186 = __VLS_185({
    percentage: (Number(__VLS_ctx.serverInfo.cpuUsage) || 0),
    strokeWidth: (8),
    color: (__VLS_ctx.getProgressColor(__VLS_ctx.serverInfo.cpuUsage)),
    showText: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_185));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-value" },
});
(Number(__VLS_ctx.serverInfo.cpuUsage) || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-bar" },
});
const __VLS_188 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
    percentage: (Number(__VLS_ctx.serverInfo.memoryUsage) || 0),
    strokeWidth: (8),
    color: (__VLS_ctx.getProgressColor(__VLS_ctx.serverInfo.memoryUsage)),
    showText: (false),
}));
const __VLS_190 = __VLS_189({
    percentage: (Number(__VLS_ctx.serverInfo.memoryUsage) || 0),
    strokeWidth: (8),
    color: (__VLS_ctx.getProgressColor(__VLS_ctx.serverInfo.memoryUsage)),
    showText: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-value" },
});
(Number(__VLS_ctx.serverInfo.memoryUsage) || 0);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-item" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-label" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-bar" },
});
const __VLS_192 = {}.ElProgress;
/** @type {[typeof __VLS_components.ElProgress, typeof __VLS_components.elProgress, ]} */ ;
// @ts-ignore
const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
    percentage: (Number(__VLS_ctx.serverInfo.diskUsage) || 0),
    strokeWidth: (8),
    color: (__VLS_ctx.getProgressColor(__VLS_ctx.serverInfo.diskUsage)),
    showText: (false),
}));
const __VLS_194 = __VLS_193({
    percentage: (Number(__VLS_ctx.serverInfo.diskUsage) || 0),
    strokeWidth: (8),
    color: (__VLS_ctx.getProgressColor(__VLS_ctx.serverInfo.diskUsage)),
    showText: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_193));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "server-stat-value" },
});
(Number(__VLS_ctx.serverInfo.diskUsage) || 0);
var __VLS_159;
const __VLS_196 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
    xs: (24),
    lg: (16),
}));
const __VLS_198 = __VLS_197({
    xs: (24),
    lg: (16),
}, ...__VLS_functionalComponentArgsRest(__VLS_197));
__VLS_199.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "log-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "log-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "log-title" },
});
const __VLS_200 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
__VLS_203.slots.default;
const __VLS_204 = {}.Document;
/** @type {[typeof __VLS_components.Document, ]} */ ;
// @ts-ignore
const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({}));
const __VLS_206 = __VLS_205({}, ...__VLS_functionalComponentArgsRest(__VLS_205));
var __VLS_203;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_208 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_210 = __VLS_209({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_209));
let __VLS_212;
let __VLS_213;
let __VLS_214;
const __VLS_215 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.push('/monitor/operlog');
    }
};
__VLS_211.slots.default;
const __VLS_216 = {}.ElIcon;
/** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
// @ts-ignore
const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({}));
const __VLS_218 = __VLS_217({}, ...__VLS_functionalComponentArgsRest(__VLS_217));
__VLS_219.slots.default;
const __VLS_220 = {}.ArrowRight;
/** @type {[typeof __VLS_components.ArrowRight, ]} */ ;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({}));
const __VLS_222 = __VLS_221({}, ...__VLS_functionalComponentArgsRest(__VLS_221));
var __VLS_219;
var __VLS_211;
const __VLS_224 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
    data: (__VLS_ctx.operLogs),
    ...{ style: {} },
    showHeader: (true),
    size: "default",
    stripe: true,
}));
const __VLS_226 = __VLS_225({
    data: (__VLS_ctx.operLogs),
    ...{ style: {} },
    showHeader: (true),
    size: "default",
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_225));
__VLS_227.slots.default;
const __VLS_228 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
    prop: "operName",
    label: "操作人",
    width: "100",
}));
const __VLS_230 = __VLS_229({
    prop: "operName",
    label: "操作人",
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_229));
const __VLS_232 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
    prop: "operModule",
    label: "操作模块",
    width: "120",
}));
const __VLS_234 = __VLS_233({
    prop: "operModule",
    label: "操作模块",
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
const __VLS_236 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
    prop: "operType",
    label: "操作类型",
    width: "80",
}));
const __VLS_238 = __VLS_237({
    prop: "operType",
    label: "操作类型",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_237));
__VLS_239.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_239.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_240 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        type: (__VLS_ctx.getOperTypeTagType(row.operType)),
        size: "small",
    }));
    const __VLS_242 = __VLS_241({
        type: (__VLS_ctx.getOperTypeTagType(row.operType)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    (row.operType);
    var __VLS_243;
}
var __VLS_239;
const __VLS_244 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
    prop: "operTime",
    label: "操作时间",
    minWidth: "160",
}));
const __VLS_246 = __VLS_245({
    prop: "operTime",
    label: "操作时间",
    minWidth: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_245));
__VLS_247.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_247.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatTime(row.operTime));
}
var __VLS_247;
const __VLS_248 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
    prop: "status",
    label: "状态",
    width: "80",
    align: "center",
}));
const __VLS_250 = __VLS_249({
    prop: "status",
    label: "状态",
    width: "80",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
__VLS_251.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_251.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_252 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        type: (__VLS_ctx.getStatusTagType(row.status)),
        size: "small",
    }));
    const __VLS_254 = __VLS_253({
        type: (__VLS_ctx.getStatusTagType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    __VLS_255.slots.default;
    (__VLS_ctx.getStatusText(row.status));
    var __VLS_255;
}
var __VLS_251;
var __VLS_227;
var __VLS_199;
var __VLS_155;
/** @type {__VLS_StyleScopedClasses['dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-section']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-card']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-left']} */ ;
/** @type {__VLS_StyleScopedClasses['greeting']} */ ;
/** @type {__VLS_StyleScopedClasses['date-time']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['welcome-right']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-stat']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-section']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['trend-label']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-section']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-tabs']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-body']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-body']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-section']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-body']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-body']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
/** @type {__VLS_StyleScopedClasses['content-section']} */ ;
/** @type {__VLS_StyleScopedClasses['action-card']} */ ;
/** @type {__VLS_StyleScopedClasses['action-header']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-entry']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-item']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['quick-title']} */ ;
/** @type {__VLS_StyleScopedClasses['server-card']} */ ;
/** @type {__VLS_StyleScopedClasses['server-header']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['up']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-item']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-label']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['server-stat-value']} */ ;
/** @type {__VLS_StyleScopedClasses['log-card']} */ ;
/** @type {__VLS_StyleScopedClasses['log-header']} */ ;
/** @type {__VLS_StyleScopedClasses['log-title']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VChart: VChart,
            Calendar: Calendar,
            Sunny: Sunny,
            Moon: Moon,
            CaretTop: CaretTop,
            CaretBottom: CaretBottom,
            TrendCharts: TrendCharts,
            DataAnalysis: DataAnalysis,
            PieChartIcon: PieChartIcon,
            Monitor: Monitor,
            Histogram: Histogram,
            MagicStick: MagicStick,
            Document: Document,
            Cpu: Cpu,
            ArrowRight: ArrowRight,
            router: router,
            userStore: userStore,
            currentDateTime: currentDateTime,
            greetingText: greetingText,
            isDaytime: isDaytime,
            overview: overview,
            serverInfo: serverInfo,
            operLogs: operLogs,
            growthTrendType: growthTrendType,
            quickStats: quickStats,
            statCards: statCards,
            quickEntries: quickEntries,
            userGrowthChartOption: userGrowthChartOption,
            operationTypeChartOption: operationTypeChartOption,
            resourceChartOption: resourceChartOption,
            loginDistributionChartOption: loginDistributionChartOption,
            formatNumber: formatNumber,
            formatTime: formatTime,
            getProgressColor: getProgressColor,
            getOperTypeTagType: getOperTypeTagType,
            getStatusText: getStatusText,
            getStatusTagType: getStatusTagType,
            handleQuickEntry: handleQuickEntry,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map
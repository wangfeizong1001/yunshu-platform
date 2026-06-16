import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
/**
 * 格式化日期
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
};
/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date) => {
    return dayjs(date).fromNow();
};
/**
 * 格式化日期范围
 */
export const formatDateRange = (start, end) => {
    return `${formatDate(start, 'YYYY-MM-DD')} - ${formatDate(end, 'YYYY-MM-DD')}`;
};
//# sourceMappingURL=format.js.map
/**
 * 服务器监控 API
 */
import { request } from '@/utils/httpClient';
export const getServerInfo = () => {
    return request({
        url: '/monitor/server',
        method: 'GET'
    });
};
//# sourceMappingURL=server.api.js.map
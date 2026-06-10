/**
 * 服务器监控 API
 */
import request from '@/utils/request';
export const getServerInfo = () => {
  return request({
    url: '/monitor/server',
    method: 'get',
  });
};
//# sourceMappingURL=server.api.js.map

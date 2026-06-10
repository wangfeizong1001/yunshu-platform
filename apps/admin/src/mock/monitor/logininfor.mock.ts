/**
 * 登录日志 Mock 数据
 *
 * @module @yunshu/admin/mock/monitor
 */

import type { ILogininfor } from '@yunshu/shared';

export const logininforMockData: ILogininfor[] = Array.from({ length: 50 }, (_, i) => {
  const status = i % 15 === 0 ? '1' : '0';
  return {
    infoId: String(i + 1),
    userName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
    loginAccount: `admin${i % 5 === 0 ? '' : i}`,
    status,
    loginLocation: [
      '北京市海淀区',
      '上海市浦东新区',
      '广州市天河区',
      '深圳市南山区',
      '杭州市西湖区',
    ][i % 5],
    operationType: ['登录', '登出', '修改密码', '注册'][i % 4] as ILogininfor['operationType'],
    os: ['Windows 10', 'macOS', 'Linux', 'iOS', 'Android'][i % 5],
    browser: ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4],
    loginTime: new Date(Date.now() - i * 1800000).toISOString(),
    msg: status === '0' ? '登录成功' : '账号密码错误',
    ip: `192.168.${i % 255}.${(i % 200) + 1}`,
    createTime: new Date(Date.now() - i * 1800000).toISOString(),
  };
});

/**
 * 操作日志 Mock 数据
 *
 * @module @yunshu/admin/mock/monitor
 */


export const operlogMockData: any[] = Array.from({ length: 50 }, (_, i) => ({
  operId: String(i + 1),
  operName: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
  operTime: new Date(Date.now() - i * 3600000).toISOString(),
  operType: ['查询', '新增', '修改', '删除', '导出'][i % 5] as IOperlog['operType'],
  operModule: ['用户管理', '角色管理', '菜单管理', '部门管理', '岗位管理'][i % 5],
  status: i % 10 === 0 ? '1' : '0',
  requestMethod: ['GET', 'POST', 'PUT', 'DELETE'][i % 4],
  operUrl: `/api/system/${['user', 'role', 'menu', 'dept', 'post'][i % 5]}/${i + 1}`,
  operIp: `192.168.${i % 255}.${(i % 200) + 1}`,
  operSystem: 'Windows 10',
  browser: ['Chrome', 'Firefox', 'Edge', 'Safari'][i % 4],
  costTime: Math.floor(Math.random() * 5000) + 100,
  operLocation: ['北京市海淀区', '上海市浦东新区', '广州市天河区', '深圳市南山区', '杭州市西湖区'][i % 5],
  operParam: JSON.stringify({ id: i + 1, name: `name${i + 1}` }),
  jsonResult: JSON.stringify({ code: 200, message: 'success' }),
  createTime: new Date(Date.now() - i * 3600000).toISOString(),
}))

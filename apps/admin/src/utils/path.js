/**
 * 判断是否为外部链接
 */
export const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};
/**
 * 判断路径是否绝对路径
 */
export const isAbsolutePath = (path) => {
  return /^([a-z][a-z\d+\-.]*:)?\/\//.test(path);
};
/**
 * 规范化路径
 */
export const normalizePath = (...paths) => {
  return paths.join('/').replace(/\/+/g, '/').replace(/^\/+/, '/').replace(/\/$/, '');
};
/**
 * 解析 URL 参数
 */
export const parseQuery = (search) => {
  const query = {};
  const params = new URLSearchParams(search);
  params.forEach((value, key) => {
    query[key] = value;
  });
  return query;
};
/**
 * 序列化参数为 URL 查询字符串
 */
export const stringifyQuery = (query) => {
  const params = new URLSearchParams();
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });
  return params.toString();
};
/**
 * 获取路径名
 */
export const getPathName = (path) => {
  const lastSlashIndex = path.lastIndexOf('/');
  return lastSlashIndex === -1 ? path : path.substring(lastSlashIndex + 1);
};
//# sourceMappingURL=path.js.map

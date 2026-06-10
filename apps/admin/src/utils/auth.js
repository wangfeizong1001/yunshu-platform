/**
 * Token管理工具
 */
const TOKEN_KEY = 'YUNSHU_TOKEN';
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || '';
};
export const setToken = (token) => {
    return localStorage.setItem(TOKEN_KEY, token);
};
export const removeToken = () => {
    return localStorage.removeItem(TOKEN_KEY);
};
//# sourceMappingURL=auth.js.map
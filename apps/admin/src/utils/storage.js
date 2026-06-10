/**
 * 本地存储工具
 */
export const LocalStorage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },
  get(key, defaultValue) {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch {
      return value || defaultValue;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};
export const SessionStorage = {
  set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
  },
  get(key, defaultValue) {
    const value = sessionStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch {
      return value || defaultValue;
    }
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  },
};
//# sourceMappingURL=storage.js.map

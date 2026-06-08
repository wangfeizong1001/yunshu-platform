/**
 * 本地存储工具
 */

export const LocalStorage = {
  set(key: string, value: any) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },
  get(key: string, defaultValue?: any) {
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value!)
    } catch {
      return value || defaultValue
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

export const SessionStorage = {
  set(key: string, value: any) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    sessionStorage.setItem(key, value)
  },
  get(key: string, defaultValue?: any) {
    const value = sessionStorage.getItem(key)
    try {
      return JSON.parse(value!)
    } catch {
      return value || defaultValue
    }
  },
  remove(key: string) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  }
}


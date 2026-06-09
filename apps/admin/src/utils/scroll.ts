/**
 * 滚动处理工具
 */

export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

export const scrollToElement = (selector: string, smooth = true) => {
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

export const scrollToBottom = (smooth = true) => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

export const getScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
}

export const setScrollTop = (top: number, smooth = true) => {
  window.scrollTo({
    top,
    behavior: smooth ? 'smooth' : 'auto'
  })
}


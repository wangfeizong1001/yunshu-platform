/**
 * 日期处理工具
 */

import dayjs from 'dayjs'

export const formatDate = (date: any, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: any) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const formatDateOnly = (date: any) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const formatTimeOnly = (date: any) => {
  return dayjs(date).format('HH:mm:ss')
}

export const getRelativeTime = (date: any) => {
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'second')
  
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`
  } else {
    return formatDateOnly(date)
  }
}

export const getWeekDay = (date: any) => {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `星期${weekDays[dayjs(date).day()]}`
}

export const getAge = (birthDate: any) => {
  const now = dayjs()
  const birth = dayjs(birthDate)
  let age = now.year() - birth.year()
  const monthDiff = now.month() - birth.month()
  if (monthDiff < 0 || (monthDiff === 0 && now.date() < birth.date())) {
    age--
  }
  return age
}


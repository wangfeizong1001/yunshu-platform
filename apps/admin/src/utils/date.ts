import dayjs from 'dayjs'

export const formatDate = (date: string | number | Date | null | undefined, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (date === null || date === undefined || date === '') return ''
  const d = dayjs(date)
  return d.isValid() ? d.format(format) : ''
}

export const formatDateTime = (date: string | number | Date | null | undefined) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

export const formatDateOnly = (date: string | number | Date | null | undefined) => {
  return formatDate(date, 'YYYY-MM-DD')
}

export const formatTimeOnly = (date: string | number | Date | null | undefined) => {
  return formatDate(date, 'HH:mm:ss')
}

export const getRelativeTime = (date: string | number | Date | null | undefined) => {
  if (date === null || date === undefined || date === '') return ''
  const now = dayjs()
  const target = dayjs(date)
  if (!target.isValid()) return ''
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

export const getWeekDay = (date: string | number | Date | null | undefined) => {
  if (date === null || date === undefined || date === '') return ''
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const d = dayjs(date)
  return d.isValid() ? `星期${weekDays[d.day()]}` : ''
}

export const getAge = (birthDate: string | number | Date | null | undefined) => {
  if (birthDate === null || birthDate === undefined || birthDate === '') return 0
  const now = dayjs()
  const birth = dayjs(birthDate)
  if (!birth.isValid()) return 0
  let age = now.year() - birth.year()
  const monthDiff = now.month() - birth.month()
  if (monthDiff < 0 || (monthDiff === 0 && now.date() < birth.date())) {
    age--
  }
  return age
}

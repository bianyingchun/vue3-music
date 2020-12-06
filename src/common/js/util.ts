import moment from 'moment'
moment.locale('zh-cn')
export const formatTime = (time: any, pattern = 'll') => {
  return moment(time).format(pattern)
}
export const isObject = (target: any) => {
  return typeof target === 'object' && target !== null
}

export const formatNumber = (num: number, ignoreZero = false) => {
  if (num === 0 && ignoreZero) {
    return ''
  } else if (num > 9999 && num <= 9999999) {
    return Math.floor(num / 10000) + '万'
  } else if (num > 9999999) {
    return Math.floor(num / 10000000) + '千万'
  }
  return num
}

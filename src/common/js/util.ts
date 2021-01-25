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

export const fotmatTime = (t: number) => {
  t = Math.floor(t / 1000)
  let m: string | number = Math.floor(t / 60)
  let s: string | number = t % 60
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  return m + ':' + s
}

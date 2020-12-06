import { isObject } from './util'
import { Track } from '@/typing/playlist'
export const SEARCH_KEY = '__search__'
export const SEARCH_MAX_LEN = 15

export const PLAY_KEY = '__play__'
export const PLAY_MAX_LEN = 200

export function insertArray<T>(
  arr: T[],
  val: T,
  compare: any,
  maxLen?: number
) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
export function deleteFromArray(arr: any[], compare: any) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
export const getStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const setStorage = (key: string, value: any) => {
  if (isObject(value)) {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(key)
}

export const clearStorage = () => localStorage.clear()

export const loadPlay = () => {
  const list = getStorage(PLAY_KEY)
  return list ? JSON.parse(list) : []
}

export const savePlay = (song: Track) => {
  const list = loadPlay()
  insertArray<Track>(list, song, (item: Track) => item.id === song.id)
}

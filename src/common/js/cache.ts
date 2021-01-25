import { isObject } from './util'
import { Theme, Track } from '@/types'
export const SEARCH_KEY = '__search__'
export const SEARCH_MAX_LEN = 15

export const PLAY_KEY = '__play__'
export const PLAY_MAX_LEN = 200

export const THEME_KEY = '__theme__'

export function insertArray<T>(
  arr: T[],
  val: T,
  compare: (item: T, index?: number) => boolean,
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
export function deleteFromArray<T>(
  arr: T[],
  compare: (item: T, index?: number) => boolean
) {
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
  insertArray<Track>(
    list,
    song,
    (item: Track) => item.id === song.id,
    PLAY_MAX_LEN
  )
}

export const loadSearch = () => {
  const list = getStorage(SEARCH_KEY)
  return (list ? JSON.parse(list) : []) as string[]
}

export const saveSearch = (query: string) => {
  const list = loadSearch()
  insertArray<string>(
    list,
    query,
    (item: string) => item === query,
    SEARCH_MAX_LEN
  )
  setStorage(SEARCH_KEY, list)
  return list
}

export const clearSearch = () => {
  setStorage(SEARCH_KEY, [])
  return []
}

export const deleteSearch = (query: string) => {
  const list = loadSearch()
  deleteFromArray<string>(list, item => item === query)
  setStorage(SEARCH_KEY, list)
  return list
}

export const loadTheme = () => {
  return getStorage(THEME_KEY)
}

export const saveTheme = (theme: Theme) => {
  setStorage(THEME_KEY, theme)
}

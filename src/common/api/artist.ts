import request from './request'

import { SongList, ArtistProfile, ArtistList } from '@/typing'

export function getTopSongList(id: number) {
  return request<SongList>('/artist/top/song', 'get', { id })
}
interface SParams {
  order?: 'hot' | 'time'
  limit?: number
  offset?: number
}
export function getSongList(id: number, params: SParams = {}) {
  return request<SongList>('/artist/songs', 'get', { id, ...params })
}

export function getArtistProfile(id: number) {
  return request<ArtistProfile>('/artists', 'get', { id })
}
// export function getAlbumList(id: number, params: PageParams = {}) {
//   return request<any>('art')
// }
interface AParams {
  limit?: number
  offset?: number
  type?: number
  area?: number
}
export function getArtistList(params: AParams = {}) {
  return request<ArtistList>('/artist/list', 'get', params)
}

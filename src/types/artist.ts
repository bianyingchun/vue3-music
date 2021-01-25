import { Track } from './song'
export interface ArtistProfile {
  artist: Artist
  hotSongs: Track[]
  more: boolean
  code: number
}
export interface Artist {
  img1v1Id: number
  topicPerson: number
  picUrl: string
  briefDesc: string
  musicSize: number
  albumSize: number
  picId: number
  followed: boolean
  img1v1Url: string
  alias: any[]
  trans: string
  name: string
  id: number
  publishTime: number
  accountId: number
  picId_str: string
  img1v1Id_str: string
  mvSize: number
}
export interface ArtistList {
  artists: Artist[]
  more: boolean
}

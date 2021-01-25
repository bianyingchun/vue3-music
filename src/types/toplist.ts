import { Playlist } from './playlist'
export interface AllToplist {
  code: number
  list: Playlist[]
  artistToplist: ArtistToplist
}

export interface ArtistToplist {
  coverUrl: string
  name: string
  upateFrequency: string
  position: number
  updateFrequency: string
}

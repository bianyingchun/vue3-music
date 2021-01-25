import { Artist, Track2, Playlist3, User } from '.'
export interface SearchHotData {
  code: number
  data: HotSearchItem[]
  message: string
}

export interface HotSearchItem {
  searchWord: string
  score: number
  content: string
  source: number
  iconType: number
  iconUrl?: string
  url: string
  alg: string
}

export interface SearchSuggestData {
  result: {
    allMatch: SuggestItem[]
  }
  code: number
}

export interface SuggestItem {
  keyword: string
  type: number
  alg: string
  lastKeyword: string
  feature: string
}

export interface SearchDefaultData {
  code: number
  message?: any
  data: SearchDefault
}

export interface SearchDefault {
  showKeyword: string
  realkeyword: string
  searchType: number
  action: number
  alg: string
  gap: number
  source?: any
}
export interface SearchArtistResult {
  result: {
    artistCount: number
    hasMore: boolean
    artists: Artist[]
  }
  code: number
}

export interface SearchPlaylistResult {
  result: {
    playlists: Playlist3[]
    hasMore: boolean
    playlistCount: number
  }
  code: number
}

export interface SearchTrackResult {
  result: {
    songs: Track2[]
    hasMore: boolean
    songCount: number
  }
  code: number
}

export interface SearchUserResult {
  result: {
    hasMore: boolean
    userprofileCount: number
    userprofiles: User[]
  }
}

export interface SearchTypeItem {
  name: string
  type: string
  val: SearchTypeVal
}

export enum SearchTypeVal {
  track = 1,
  artist = 100,
  playlist = 1000,
  user = 1002
}

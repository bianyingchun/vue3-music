import {
  Playlist,
  Tag,
  CategoryList,
  Playlist2,
  Track,
  PlayMode,
  Theme,
  ThemeItem,
  ParsedLyricData,
  LoginStatus
} from '.'
export interface GlobalState {
  playlists: PlaylistsState
  system: SystemState
  player: PlayerState
  auth: AuthState
  search: SearchState
}

export interface PlaylistsState {
  loading: boolean
  posting: boolean
  list: Playlist[]
  hqTags: Tag[]
  catlist: CategoryList[]
  detail: Playlist2 | null
  mine: {
    faved: Playlist[]
    created: Playlist[]
    likelist: Playlist | null
    likelistIds: number[]
  }
}
export interface PlayerState {
  playList: Track[]
  sequenceList: Track[]
  currentIndex: number
  mode: PlayMode
  fullScreen: boolean
  playing: boolean
  playHistory: Track[]
  currentTime: number
  lyric: {
    data: ParsedLyricData
    currentIndex: number
    fetching: boolean
  }
}

export interface SystemState {
  theme: {
    list: ThemeItem[]
    current: Theme
  }
}

export interface SearchState {
  history: string[]
}

export interface AuthState extends LoginStatus {
  loginVisible: boolean
  isLogining: boolean
  isLogouting: boolean
}

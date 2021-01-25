import { Artist } from './artist'
import { Track, TrackId, Track2 } from './song'
import { User } from './user'
export interface PlaylistDetail {
  code: number
  relatedVideos?: any
  playlist: Playlist2
  urls?: any
  privileges: Privilege[]
}
interface Privilege {
  id: number
  fee: number
  payed: number
  st: number
  pl: number
  dl: number
  sp: number
  cp: number
  subp: number
  cs: boolean
  maxbr: number
  fl: number
  toast: boolean
  flag: number
  preSell: boolean
  playMaxbr: number
  downloadMaxbr: number
  chargeInfoList: ChargeInfoList[]
}

interface ChargeInfoList {
  rate: number
  chargeUrl?: any
  chargeMessage?: any
  chargeType: number
}

export interface Playlist {
  name: string //
  id: number
  trackNumberUpdateTime: number
  status: number
  userId: number
  createTime: number
  updateTime: number
  subscribedCount: number
  trackCount: number
  cloudTrackCount: number
  coverImgUrl: string
  coverImgId: number
  description: string
  tags: string[]
  playCount: number
  trackUpdateTime: number
  specialType: number
  totalDuration: number
  creator: Subscriber
  tracks?: any
  subscribers: Subscriber[]
  subscribed?: boolean
  commentThreadId: string
  newImported: boolean
  adType: number
  highQuality: boolean
  privacy: number
  ordered: boolean
  anonimous?: boolean
  coverStatus: number
  recommendInfo?: any
  shareCount: number
  commentCount: number
  copywriter?: string
  tag?: string
  coverImgId_str?: string
  updateFrequency?: string
  ToplistType?: string
}
export interface Playlist2 extends Playlist {
  subscribers: Subscriber[]
  tracks: Track[]
  videoIds?: any
  videos?: any
  trackIds: TrackId[]
  backgroundCoverId: number
  backgroundCoverUrl?: any
  titleImage: number
  titleImageUrl?: any
  englishTitle?: any
  opRecommend: boolean
  artists?: Artist[]
}

interface Subscriber extends User {
  defaultAvatar: boolean
  province: number
  city: number
  birthday: number
  description: string
  detailDescription: string
  avatarImgId: number //
  backgroundImgId: number
  backgroundUrl: string
  djStatus: number
  authenticationTypes: number
  avatarImgIdStr: string
  backgroundImgIdStr: string
  anchor: boolean
  avatarImgId_str: string
}

export interface Categories {
  [id: string]: string
}

export interface Category {
  name: string
  resourceCount: number
  imgId: number
  imgUrl?: any
  type: number
  category: number
  resourceType: number
  hot: boolean
  activity: boolean
}

export interface CategoryList {
  name: string
  children: Category[]
}

export interface Tag {
  id: number
  name: string
  type: number
  category: number
  hot: boolean
}

export interface HqTagList {
  tags: Tag[]
  code: number
}

export interface Plycatlist {
  all: Category
  sub: Category[]
  categories: Categories
}

export interface PlaylistPage {
  playlists: Playlist[]
  code: number
  more: boolean
  lasttime: number
  total: number
}

export interface CreatePlaylistRes {
  playlist?: Playlist
  code: number
  message?: string
}

export interface Playlist3 {
  id: number
  name: string
  coverImgUrl: string
  creator: Creator
  subscribed: boolean
  trackCount: number
  userId: number
  playCount: number
  bookCount: number
  specialType: number
  officialTags?: any
  description?: string
  highQuality: boolean
  track: Track2
  alg: string
}

interface Creator {
  nickname: string
  userId: number
  userType: number
  authStatus: number
  expertTags?: any
  experts?: any
}

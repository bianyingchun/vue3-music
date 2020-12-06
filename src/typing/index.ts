import { Track, Playlist as PlaylistDetail } from './playlist'
import { ParsedLyricDta } from './song'
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface Plycatlist {
  all: Category
  sub: Category[]
  categories: Categories
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

export interface PlaylistsState {
  loading: boolean
  list: Playlist[]
  hqTags: Tag[]
  catlist: CategoryList[]
  detail: PlaylistDetail | null
  mine: {
    faved: Playlist[]
    created: Playlist[]
    likelist: Playlist | null
    likelistIds: number[]
  }
}

export interface CategoryList {
  name: string
  children: Category[]
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface PlaylistPage {
  playlists: Playlist[]
  code: number
  more: boolean
  lasttime: number
  total: number
}

export interface Playlist {
  name: string
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
  creator: Creator
  tracks?: any
  subscribers: Subscriber[]
  subscribed?: any
  commentThreadId: string
  newImported: boolean
  adType: number
  highQuality: boolean
  privacy: number
  ordered: boolean
  anonimous: boolean
  coverStatus: number
  recommendInfo?: any
  shareCount: number
  commentCount: number
  copywriter: string
  tag: string
  coverImgId_str?: string
}

interface Subscriber {
  defaultAvatar: boolean
  province: number
  authStatus: number
  followed: boolean
  avatarUrl: string
  accountStatus: number
  gender: number
  city: number
  birthday: number
  userId: number
  userType: number
  nickname: string
  signature: string
  description: string
  detailDescription: string
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  authority: number
  mutual: boolean
  expertTags?: any
  experts?: any
  djStatus: number
  vipType: number
  remarkName?: any
  authenticationTypes: number
  avatarDetail?: any
  avatarImgIdStr: string
  backgroundImgIdStr: string
  anchor: boolean
  avatarImgId_str?: string
}

interface Creator {
  defaultAvatar: boolean
  province: number
  authStatus: number
  followed: boolean
  avatarUrl: string
  accountStatus: number
  gender: number
  city: number
  birthday: number
  userId: number
  userType: number
  nickname: string
  signature: string
  description: string
  detailDescription: string
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  authority: number
  mutual: boolean
  expertTags: string[]
  experts?: object
  djStatus: number
  vipType: number
  remarkName?: any
  authenticationTypes: number
  avatarDetail: AvatarDetail
  avatarImgIdStr: string
  backgroundImgIdStr: string
  anchor: boolean
  avatarImgId_str?: string
}

interface AvatarDetail {
  userType: number
  identityLevel?: any
  identityIconUrl: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface PageParams {
  limit?: number
  offset?: number
}

export type THEME_TYPES = 'default' | 'dark'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ConfigState {
  theme: THEME_TYPES
}

export enum PlayMode {
  sequence = 0,
  random,
  loop
}
export interface PlayerState {
  playList: Track[]
  sequenceList: Track[]
  currentIndex: number
  mode: PlayMode
  playing: boolean
  playHistory: Track[]
  currentTime: number
  lyric: {
    data: ParsedLyricDta
    currentIndex: number
    fetching: boolean
  }
}

export interface GlobalState {
  playlists: PlaylistsState
  config: ConfigState
  player: PlayerState
  auth: AuthState
}

export interface HqTagList {
  tags: Tag[]
  code: number
}

export interface Tag {
  id: number
  name: string
  type: number
  category: number
  hot: boolean
}
export interface AuthState {
  logined: boolean
  profile?: Profile
  account?: Account
}
export interface Profile {
  avatarDetail: AvatarDetail
  avatarImgIdStr: string
  description: string
  userId: number
  nickname: string
  avatarUrl: string
  experts: any
  expertTags?: any
  djStatus: number
  accountStatus: number
  birthday: number
  gender: number
  province: number
  city: number
  defaultAvatar: boolean
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  mutual: boolean
  followed: boolean
  remarkName?: any
  authStatus: number
  detailDescription: string
  vipType: number
  userType: number
  createTime: number
  backgroundImgIdStr: string
  signature: string
  authority: number
  allAuthTypes: AllAuthType[]
  followeds: number
  follows: number
  blacklist: boolean
  artistId: number
  eventCount: number
  allSubscribedCount: number
  playlistBeSubscribedCount: number
  mainAuthType: MainAuthType
  avatarImgId_str: string
  followTime: string
  followMe: boolean
  artistIdentity: number[]
  cCount: number
  sDJPCount: number
  artistName: string
  playlistCount: number
  sCount: number
  newFollows: number
}
export interface Account {
  id: number
  userName: string
  type: number
  status: number
  whitelistAuthority: number
  createTime: number
  tokenVersion: number
  ban: number
  baoyueVersion: number
  donateVersion: number
  vipType: number
  anonimousUser: boolean
  paidFee: boolean
}

export interface UserPlaylistData {
  more: boolean
  playlist: Playlist[]
}

export interface UserDetail {
  identify: Identify
  level: number
  listenSongs: number
  userPoint: UserPoint
  mobileSign: boolean
  pcSign: boolean
  profile: Profile
  peopleCanSeeMyPlayRecord: boolean
  bindings: Binding[]
  adValid: boolean
  code: number
  createTime: number
  createDays: number
}

interface Binding {
  url: string
  userId: number
  expiresIn: number
  refreshTime: number
  bindingTime: number
  tokenJsonStr?: any
  expired: boolean
  id: number
  type: number
}

interface MainAuthType {
  type: number
  desc: string
  tags: string[]
}

interface AllAuthType {
  type: number
  desc: string
  tags?: string[]
}

interface UserPoint {
  userId: number
  balance: number
  updateTime: number
  version: number
  status: number
  blockBalance: number
}

interface Identify {
  imageUrl: string
  imageDesc: string
  actionUrl?: any
}

export interface UserRecord {
  code: number
  allData: RecordData[]
  weekData: RecordData[]
}

export interface RecordData {
  playCount: number
  score: number
  song: Track
}

export interface SongList {
  code: number
  more: boolean
  total?: number
  songs: Track[]
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

export interface ArtistProfile {
  artist: Artist
  hotSongs: Track[]
  more: boolean
  code: number
}

export interface ArtistList {
  artists: Artist[]
  more: boolean
}
export interface FollowedList {
  code: number
  more: boolean
  followeds: User[]
}
export interface FollowList {
  follow: User[]
  touchCount: number
  more: boolean
  code: number
}

export interface User {
  py: string
  time: number
  mutual: boolean
  accountStatus: number
  avatarUrl: string
  followeds: number
  userType: number
  avatarDetail?: AvatarDetail
  follows: number
  remarkName?: any
  nickname: string
  vipType: number
  followed: boolean
  userId: number
  authStatus: number
  gender: number
  expertTags?: any
  experts?: any
  signature?: string
  vipRights?: VipRight
  eventCount: number
  playlistCount: number
}

interface VipRight {
  associator?: Associator
  musicPackage?: Associator
  redVipAnnualCount: number
  redVipLevel: number
}

interface Associator {
  vipCode: number
  rights: boolean
}

export interface RecommendSongs {
  code: number
  data: {
    dailySongs: Track[]
    orderSongs: any[]
    recommendReasons: RecommendReason[]
  }
}
interface RecommendReason {
  songId: number
  reason: string
}

export interface CreatePlaylistRes {
  playlist?: Playlist
  code: number
  message?: string
}

import { Playlist } from './playlist'
import { Track } from './song'
export interface LoginStatus {
  profile?: Profile
  account?: Account
  code: number
  message?: string
  msg: string
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
export interface Profile extends User {
  avatarDetail: AvatarDetail
  avatarImgIdStr: string
  description: string
  djStatus: number
  accountStatus: number
  birthday: number
  province: number
  city: number
  defaultAvatar: boolean
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  detailDescription: string
  userType: number
  createTime: number
  backgroundImgIdStr: string
  authority: number
  allAuthTypes: AuthType[]
  blacklist: boolean
  artistId: number
  allSubscribedCount: number
  playlistBeSubscribedCount: number
  mainAuthType: AuthType
  avatarImgId_str: string
  followTime: string
  followMe: boolean
  artistIdentity: number[]
  cCount: number
  sDJPCount: number
  artistName: string
  sCount: number
  newFollows: number
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
export interface User {
  py?: string
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

export interface AvatarDetail {
  userType: number
  identityLevel?: any
  identityIconUrl: string
}

interface AuthType {
  type: number
  desc: string
  tags?: string[]
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
export interface UserPlaylistData {
  more: boolean
  playlist: Playlist[]
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

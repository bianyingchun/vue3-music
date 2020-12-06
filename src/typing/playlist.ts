import { Artist } from './index'
export interface PlayListDetail {
  code: number
  relatedVideos?: any
  playlist: Playlist
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
  subscribers: Subscriber[]
  subscribed?: boolean
  creator: Subscriber
  tracks: Track[]
  videoIds?: any
  videos?: any
  trackIds: TrackId[]
  updateFrequency?: string
  backgroundCoverId: number
  backgroundCoverUrl?: any
  titleImage: number
  titleImageUrl?: any
  englishTitle?: any
  opRecommend: boolean
  trackNumberUpdateTime: number
  adType: number
  updateTime: number
  coverImgId: number
  userId: number
  subscribedCount: number
  cloudTrackCount: number
  createTime: number
  highQuality: boolean
  newImported: boolean
  specialType: number
  coverImgUrl: string
  trackCount: number
  commentThreadId: string
  privacy: number
  trackUpdateTime: number
  playCount: number
  tags: string[]
  ordered: boolean
  description: string
  status: number
  name: string
  id: number
  shareCount: number
  coverImgId_str: string
  commentCount: number
  // toplist
  ToplistType?: string
  artists?: Artist[]
  totalDuration?: number
}

// specialType = 10 榜单
export interface TrackId {
  id: number
  v: number
  at: number
  alg?: any
  lr: number // 上次排名
}

export interface Track {
  name: string
  id: number
  pst: number
  t: number
  ar: Ar[]
  alia: any[]
  pop: number
  st: number
  rt?: string
  fee: number
  v: number
  crbt?: any
  cf: string
  al: Al
  dt: number
  h?: H
  m?: H
  l: H
  a?: any
  cd: string
  no: number
  rtUrl?: any
  ftype: number
  rtUrls: any[]
  djId: number
  copyright: number
  s_id: number
  mark: number
  originCoverType: number
  noCopyrightRcmd?: any
  rtype: number
  rurl?: any
  mst: number
  cp: number
  mv: number
  publishTime: number
}

interface H {
  br: number
  fid: number
  size: number
  vd: number
}

interface Al {
  id: number
  name: string
  picUrl: string
  tns: any[]
  pic_str?: string
  pic: number
}

export interface Ar {
  id: number
  name: string
  tns: any[]
  alias: any[]
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
  avatarImgId_str: string
}

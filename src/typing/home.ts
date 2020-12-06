import { Artist } from './index'
export interface OriginHomePageData {
  code: number
  data: Data
  message: string
}

interface Data {
  cursor: string
  blocks: Block[]
  hasMore: boolean
  blockUUIDs?: any
  pageConfig: PageConfig
  guideToast: GuideToast
}

interface GuideToast {
  hasGuideToast: boolean
  toastList: any[]
}

interface PageConfig {
  refreshToast: string
  nodataToast: string
  refreshInterval: number
  title?: any
  fullscreen: boolean
  abtest: string[]
  songLabelMarkPriority: string[]
  songLabelMarkLimit: number
  homepageMode: string
  showModeEntry: boolean
}

export interface Block {
  blockCode: string
  showType: string
  action?: string
  actionType?: string
  uiElement: UiElement
  creatives?: Creative[]
  canClose: boolean
  alg?: string
  logInfo?: string
  extInfo?: ExtInfo[]
}

interface ExtInfo {
  popularity: number
  verticalCoverId: number
  verticalCover: string
  userInfo: UserInfo
  recLiveDTO: RecLiveDTO
  coverTag: string
  privateTag: string
  borderTag?: any
  startStreamTagName: string
  tags: any[]
  dynamicCover: DynamicCover
  liveId: number
  title: string
  anchorId: number
  coverId: number
  cover: string
  liveUrl: LiveUrl
  playBackUrl: string
  orientationScope: number
  onlineNumber: number
  liveStatus: number
  startTime: number
  endTime: number
  roomId: number
  channelId?: any
  liveType: number
  appKeyType: number
  type: number
  startStreamTag: number
  agoraRoomNo: number
  bgCoverUrl: string
  backgroundAnimateUrl?: any
}

interface LiveUrl {
  httpPullUrl: string
  hlsPullUrl: string
  rtmpPullUrl: string
}

interface DynamicCover {
  priorityLevel: number
  type: number
  playUrl?: any
}

interface RecLiveDTO {
  skipUrl: string
  typeDesc: string
  cardType: number
  alg: string
  anchorId: string
  songId: number
  accompanimentId: number
  supplemetParam: {
    coverID: string
  }
  ops: string
  recCoverId: number
  recCover: string
}

interface UserInfo {
  userId: number
  nickname: string
  avatarUrl: string
  authStatus: number
  userType: number
  authName?: string
  liveRoomNo: number
  vipType: number
  gender: number
  artistName?: any
}

export interface Creative {
  creativeType: string
  creativeId?: string
  action?: string
  actionType?: string
  uiElement: UiElement
  resources: Resource[]
  alg?: string
  position: number
  logInfo?: string
}

interface Resource {
  uiElement: UiElement
  resourceType: string
  resourceId: string
  resourceUrl?: any
  resourceExtInfo: ResourceExtInfo
  action: string
  actionType: string
  valid: boolean
  alg: string
  logInfo?: string | string
}

interface ResourceExtInfo {
  playCount?: number
  highQuality?: boolean
  artists?: Artist[]
  songData?: SongData
  songPrivilege?: SongPrivilege
  commentSimpleData?: CommentSimpleData
}
interface SongData {
  name: string
  id: number
  position: number
  alias: any[]
  status: number
  fee: number
  copyrightId: number
  disc: string
  no: number
  artists: Artist[]
  album: Album
  starred: boolean
  popularity: number
  score: number
  starredNum: number
  duration: number
  playedNum: number
  dayPlays: number
  hearTime: number
  ringtone?: (null | string)[]
  crbt?: any
  audition?: any
  copyFrom: string
  commentThreadId: string
  rtUrl?: any
  ftype: number
  rtUrls: any[]
  copyright: number
  transName?: string
  sign?: any
  mark: number
  mvid: number
  hMusic?: HMusic | HMusic
  mMusic?: HMusic | HMusic
  lMusic: HMusic
  bMusic: HMusic
  mp3Url?: any
  rtype: number
  rurl?: any
  transNames?: string[]
}
interface CommentSimpleData {
  content: string
  commentId: number
  threadId: string
  userId: number
  userName: string
}
interface HMusic {
  name?: any
  id: number
  size: number
  extension: string
  sr: number
  dfsId: number
  bitrate: number
  playTime: number
  volumeDelta: number
}

interface Album {
  name: string
  id: number
  type: string
  size: number
  picId: number
  blurPicUrl: string
  companyId: number
  pic: number
  picUrl: string
  publishTime: number
  description: string
  tags: string
  company: string
  briefDesc: string
  artist: Artist
  songs: any[]
  alias: string[][]
  status: number
  copyrightId: number
  commentThreadId: string
  artists: Artist[]
  subType: string
  transName?: (null | string)[]
  mark: number
  transNames?: string[]
  picId_str?: string
}

interface SongPrivilege {
  id: number
  fee: number
  payed: number
  realPayed: number
  st: number
  pl: number
  dl: number
  sp: number
  cp: number
  subp: number
  cs: boolean
  maxbr: number
  fl: number
  pc?: any
  toast: boolean
  flag: number
  paidBigBang: boolean
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

interface UiElement {
  mainTitle?: Title
  subTitle?: Title
  button?: Button
  image?: {
    imageUrl: string
  }
  labelTexts?: string[]
}

interface Button {
  action: string
  actionType: string
  text: string
  iconUrl?: any
}

interface Title {
  title: string
  titleType?: string
}

export interface Mix {
  id: string
  name?: string
  playCount?: number
  coverImgUrl?: string
}
export interface HomePageData {
  rcmdPlaylist?: {
    title: string
    data: Mix[]
  }
  officalPlaylist?: {
    title: string
    data: Mix[]
  }
  customSonglist?: {
    title: string
    subTitle: string
    data: Creative[]
  }
}

export interface Ball {
  id: number
  icon: string
  text: string
  url: string
}

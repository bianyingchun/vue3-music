import { Track, Track2 } from './song'
import { Artist } from './artist'
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
  songData?: Track2
  songPrivilege?: SongPrivilege
  commentSimpleData?: CommentSimpleData
}

interface CommentSimpleData {
  content: string
  commentId: number
  threadId: string
  userId: number
  userName: string
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
  id: number | string
  name: string
  playCount: number
  coverImgUrl: string
  [propName: string]: any
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

export interface BannerData {
  banners: Banner[]
  code: number
}

export interface Banner {
  pic: string
  targetId: number
  adid?: any
  targetType: number
  titleColor: string
  typeTitle: string
  url?: any
  adurlV2?: any
  exclusive: boolean
  monitorImpress?: any
  monitorClick?: any
  monitorType?: any
  monitorImpressList: any[]
  monitorClickList: any[]
  monitorBlackList?: any
  extMonitor?: any
  extMonitorInfo?: any
  adSource?: any
  adLocation?: any
  encodeId: string
  program?: any
  event?: any
  video?: any
  dynamicVideoData?: any
  song?: Song
  bannerId: string
  alg?: any
  scm: string
  requestId: string
  showAdTag: boolean
  pid?: any
  showContext?: any
  adDispatchJson?: any
}

interface Song extends Track {
  privilege: Privilege
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
  freeTrialPrivilege: FreeTrialPrivilege
  chargeInfoList: ChargeInfoList[]
}

interface ChargeInfoList {
  rate: number
  chargeUrl?: any
  chargeMessage?: any
  chargeType: number
}

interface FreeTrialPrivilege {
  resConsumable: boolean
  userConsumable: boolean
}

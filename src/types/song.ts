import { Playlist } from './playlist'
// specialType = 10 榜单
import { Artist } from './artist'
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

export interface Ar {
  id: number
  name: string
  tns: any[]
  alias: any[]
}

export interface LyricData {
  sgc: boolean
  sfy: boolean
  qfy: boolean
  transUser?: TransUser
  lyricUser?: TransUser
  lrc?: Lrc
  klyric?: Lrc
  tlyric?: Lrc
  code: number
  nolyric?: boolean
}

export interface Lrc {
  version: number
  lyric: string
}

export interface TransUser {
  id: number
  status: number
  demand: number
  userid: number
  nickname: string
  uptime: number
}

export interface Lyric {
  time: number
  value: string
}

export interface ParsedLyricData {
  transUser?: TransUser
  lyricUser?: TransUser
  nolyric?: boolean
  lrc?: Lyric[]
  klyric?: Lyric[]
  tlyric?: Lyric[]
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

export enum PlayMode {
  sequence = 0,
  random,
  loop
}

export interface PlayModeItem {
  icon: string
  text: string
  val: number
}

export interface SongList {
  code: number
  more: boolean
  total?: number
  songs: Track[]
}

export interface Track2 {
  name: string //
  id: number //
  position: number //pt
  alias: any[] //alia
  status: number //st
  fee: number //
  copyrightId: number //copyright
  disc: string
  no: number //
  artists: Artist[] // ar
  album: Album //al
  starred: boolean
  popularity?: number //pop
  score: number
  starredNum?: number
  duration: number //dt
  playedNum?: number
  dayPlays?: number
  hearTime?: number
  ringtone?: (null | string)[]
  crbt?: any
  audition?: any
  copyFrom?: string
  commentThreadId?: string
  rtUrl?: any //
  ftype: number //
  rtUrls: any[] //
  copyright: number
  transName?: string
  sign?: any
  mark: number //
  mvid: number //mv
  hMusic?: HMusic | HMusic //h
  mMusic?: HMusic | HMusic //m
  lMusic?: HMusic //l
  bMusic?: HMusic
  mp3Url?: any
  rtype: number //
  rurl?: any //
  transNames?: string[]
  index?: number
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
  type?: string
  size: number
  picId: number
  blurPicUrl: string
  companyId: number
  pic: number
  picUrl: string
  publishTime: number
  description: string
  tags: string
  company?: string
  briefDesc: string
  artist: Artist
  songs: any[]
  alias: string[]
  status: number
  copyrightId: number
  commentThreadId: string
  artists: Artist[]
  picId_str?: string
}

export interface SongDetail {
  songs: Track[]
  privileges: Privilege[]
  code: number
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

export interface SimilarPlaylistsData {
  playlists: Playlist[]
  code: number
}

export interface SimilarSongsData {
  songs: Track2[]
  code: number
}

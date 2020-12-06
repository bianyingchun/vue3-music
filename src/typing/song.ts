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

export interface ParsedLyricDta {
  transUser?: TransUser
  lyricUser?: TransUser
  nolyric?: boolean
  lrc?: Lyric[]
  klyric?: Lyric[]
  tlyric?: Lyric[]
}

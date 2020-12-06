import request from './request'
import { LyricData, ParsedLyricDta } from '@/typing/song.ts'
import { lyricParser } from '@/common/js/music'

export async function getLyric(id: number | string) {
  const data: ParsedLyricDta = {}
  const res = await request<LyricData>('/lyric', 'get', { id })
  const { lrc, tlyric, klyric, nolyric, transUser, lyricUser } = res.data
  if (nolyric) {
    data.nolyric = true
    return data
  }
  if (lrc && lrc.lyric.length) {
    data.lrc = lyricParser(lrc.lyric)
  }
  if (tlyric && tlyric.lyric.length) {
    data.tlyric = lyricParser(tlyric.lyric)
  }
  if (klyric && klyric.lyric.length) {
    data.klyric = lyricParser(klyric.lyric)
  }
  data.transUser = transUser
  data.lyricUser = lyricUser
  return data
}

//喜欢歌曲, code===200 成功
export async function likeSong(id: number, like: boolean) {
  return request<{ code: number }>('/like', 'post', { id, like })
}

import request from './request'
import { LyricData, ParsedLyricData, SongDetail } from '@/types'
import { lyricParser } from '@/common/js/music'

export async function getLyric(id: number | string) {
  const data: ParsedLyricData = {}
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

export async function getSongDetail(ids: number[]) {
  return request<SongDetail>('/song/detail', 'get', { ids: ids.join(',') })
}

export async function checkSong(id: number) {
  return request<{ success: boolean; message: string }>('check/music', 'post', {
    id
  })
}

import { Lyric, Track, Track2 } from '@/types'
export const lyricParser = (lyric: string) => {
  const lines = lyric.split('\n')
  const pattern = /\[\d{2}:\d{2}(.\d{2,})?\]/g
  const lyricList: Lyric[] = []
  lines.forEach(item => {
    const mResult = item.match(pattern)
    //提取歌词
    const value = item.replace(pattern, '')
    if (!value) return
    let time = 0
    if (mResult && mResult.length) {
      const t = mResult[0].slice(1, -1).split(':')
      time = parseInt(t[0], 10) * 60 + parseFloat(t[1])
    }
    lyricList.push({ time, value })
  })
  return lyricList
}

export const timeParser = (t: number) => {
  t = Math.floor(t / 1000)
  let m: string | number = Math.floor(t / 60)
  let s: string | number = t % 60
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s
  return m + ':' + s
}

export const transformTrack = (song: Track2): Track => {
  const {
    name,
    id,
    position,
    popularity,
    alias,
    fee,
    copyright,
    copyrightId,
    artists,
    album,
    no,
    duration,
    rurl,
    status,
    rtUrls,
    ftype,
    mvid,
    hMusic,
    mMusic,
    lMusic,
    rtype,
    mark
  } = song
  const track = {
    id,
    name,
    fee,
    rtype,
    mark,
    ftype,
    rurl,
    rtUrls,
    no,
    copyrightId,
    copyright,
    pt: position,
    alia: alias,
    st: status,
    al: album,
    ar: artists,
    pop: popularity,
    dt: duration,
    mv: mvid,
    h: hMusic,
    m: mMusic,
    l: lMusic
  }
  return (track as unknown) as Track
}

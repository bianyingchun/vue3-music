import {
  PlayModeItem,
  SearchTypeItem,
  SearchTypeVal,
  Theme,
  ThemeItem
} from '@/types'

export const PLAY_MODE = {
  sequence: 0,
  loop: 1,
  random: 2
}

export const PLAY_MODE_LIST: PlayModeItem[] = [
  {
    icon: 'icon-sequence',
    text: '循环列表',
    val: 0
  },
  { icon: 'icon-shuffle', text: '随机播放', val: 1 },
  { icon: 'icon-loop', text: '单曲循环', val: 2 }
]

export const THEME_LIST: ThemeItem[] = [
  { name: '默认', val: Theme.dark },
  { name: '暗黑', val: Theme.light }
]

export const COMMENT_TYPE = {
  music: 0,
  mv: 1,
  playlist: 2,
  album: 3,
  dj: 4,
  video: 5
}
export const COMMENT = {
  sortType: {
    music: [
      { text: '推荐', val: 1 },
      { text: '最热', val: 2 },
      { text: '最新', val: 3 }
    ],
    other: [
      { text: '推荐', val: 99 },
      { text: '最热', val: 2 },
      { text: '最新', val: 3 }
    ]
  }
}
export const ARTIST_CATEGORY = {
  type: [
    {
      text: '全部',
      val: -1
    },
    {
      text: '男',
      val: 1
    },
    {
      text: '女',
      val: 2
    },
    {
      text: '乐队/组合',
      val: 3
    }
  ],
  area: [
    {
      text: '全部',
      val: -1
    },
    {
      text: '华语',
      val: 7
    },
    {
      text: '欧美',
      val: 96
    },
    {
      text: '日本',
      val: 8
    },
    { text: '韩国', val: 16 },
    {
      text: '其他',
      val: 0
    }
  ]
}
// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑,
// 100: 歌手, 1000: 歌单, 1002: 用户, 1004:
// MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export const SEARCH_TYPES: SearchTypeItem[] = [
  {
    name: '单曲',
    type: 'track',
    val: SearchTypeVal.track
  },
  { name: '歌手', type: 'artist', val: SearchTypeVal.artist },
  { name: '歌单', type: 'playlist', val: SearchTypeVal.playlist },
  { name: '用户', type: 'user', val: SearchTypeVal.user }
]

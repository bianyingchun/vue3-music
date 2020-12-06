export const PLAY_MODE = {
  sequence: 0,
  loop: 1,
  random: 2
}

export const PLAY_MODE_LIST = [
  {
    icon: 'icon-sequence',
    text: '循环列表',
    val: 0
  },
  { icon: 'icon-shuffle', text: '随机播放', val: 1 },
  { icon: 'icon-loop', text: '单曲循环', val: 2 }
]

export const THEME = {
  dark: 'dark',
  default: 'default'
}

export const COMMENT_TYPE = {
  music: 0,
  mv: 1,
  playlist: 2,
  album: 3,
  dj: 4,
  video: 5
}
export const COMMENT = {
  type: {
    music: 0,
    mv: 1,
    playlist: 2,
    album: 3,
    dj: 4,
    video: 5
  },
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

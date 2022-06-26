import request from './request'
import {
  CategoryList,
  Plycatlist,
  PlaylistPage,
  PageParams,
  HqTagList,
  CreatePlaylistRes,
  PlaylistDetail
} from '@/types'
//歌单分类
export async function getCatlist() {
  const result = await request<Plycatlist>('/playlist/catlist', 'get')
  const { sub, categories } = result.data
  const list: CategoryList[] = []
  for (const i in categories) {
    const index = Number(i)
    list[index] = {
      name: categories[i],
      children: []
    }
  }
  sub.forEach(item => {
    const c = item.category
    if (list[c] !== undefined) {
      list[c].children.push(item)
    }
  })
  return list
}

// 歌单详情
export function getPlaylistDetail(id: number) {
  return request<PlaylistDetail>('/playlist/detail', 'get', {
    id,
    timestamp: Date.now()
  })
}

// 歌单 ( 网友精选碟 ) //歌单广场下的精品
// 可选参数 : cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从精品歌单标签列表接口获取(/playlist/highquality/tags)
// limit: 取出歌单数量 , 默认为 20
// before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
// /top/playlist/highquality?before=1503639064232&limit=3

interface HqParams {
  limit?: number
  before?: number
  cat?: string
}
export function getHqPlaylist(opts: HqParams) {
  return request<PlaylistPage>('/top/playlist/highquality/', 'get', opts)
}

// 歌单 ( 网友精选碟 )
// top/playlist?cat=韩语&order=hot
export function getTopPlaylist(cat = '全部', opts: PageParams = {}) {
  return request<PlaylistPage>('/top/playlist', 'get', {
    ...opts,
    cat
  })
}

// 精品歌单标签
export function getHqTaglist() {
  return request<HqTagList>('/playlist/highquality/tags', 'get')
}

// 订阅歌单
export function subscribePlaylist(id: number, subscribe: boolean) {
  const t = subscribe ? 1 : 2
  return request<any>('/playlist/subscribe', 'post', {
    t,
    id,
    timestamp: Date.now()
  })
}

// 对歌单添加或删除歌曲
export function updatePlaylistTracks(
  pid: number,
  trackId: number | number[],
  op: 'add' | 'del'
) {
  const tracks = Array.isArray(trackId) ? trackId.join(',') : trackId
  return request<any>('/playlist/tracks', 'get', {
    op,
    pid,
    tracks,
    timestamp: Date.now()
  })
}

// 创建歌单
export function createPlaylist(params: {
  name: string
  privacy?: boolean
  type?: 'NORMAL' | 'VIDEO'
}) {
  const { name, privacy, type } = params
  const data: any = { name }
  if (privacy) data.privacy = '10'
  if (type) data.type = type
  return request<CreatePlaylistRes>('/playlist/create', 'post', data)
}
// 删除歌单
export function deletePlaylist(pid: number | number[]) {
  const id = Array.isArray(pid) ? pid.join(',') : pid
  return request<{ code: number; message?: string }>(
    '/playlist/delete',
    'get',
    {
      id
    }
  )
}

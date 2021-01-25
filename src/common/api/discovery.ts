import request from './request'
import {
  RecommendSongs,
  OriginHomePageData,
  Block,
  HomePageData,
  BannerData
} from '@/types'
//首页-发现-圆形图标入口列表
export async function getHomeBallList() {
  const res = await request<any>('/homepage/dragon/ball', 'get')
  const list = res.data.data.slice(0, 3)
  return [
    {
      id: 0,
      icon: list[0].iconUrl as string,
      text: '每日推荐',
      url: '/taste'
    },
    {
      id: 1,
      icon: list[1].iconUrl as string,
      text: '歌单',
      url: '/playlist/square'
    },
    {
      id: 2,
      icon: list[2].iconUrl as string,
      text: '排行榜',
      url: '/toplist'
    }
  ]
}

//日推
export async function getRecommendSongs() {
  const res = await request<RecommendSongs>('/recommend/songs', 'get')
  return res.data.data.dailySongs
}

export async function getHomePage() {
  const res = await request<OriginHomePageData>('/homepage/block/page', 'get')
  if (res.data.code !== 200) return {}
  const data: HomePageData = {}
  const blocks = res.data.data.blocks
  function dealPlaylistData(block: Block) {
    const creatives = block.creatives || []
    return creatives.map(item => {
      const resource = item.resources[0]
      return {
        id: resource.resourceId,
        name: resource.uiElement.mainTitle?.title || '',
        playCount: resource.resourceExtInfo.playCount || 0,
        coverImgUrl: resource.uiElement.image?.imageUrl || ''
      }
    })
  }
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.blockCode === 'HOMEPAGE_BLOCK_PLAYLIST_RCMD') {
      data.rcmdPlaylist = {
        title: '推荐歌单',
        data: dealPlaylistData(block)
      }
    } else if (block.blockCode === 'HOMEPAGE_BLOCK_STYLE_RCMD') {
      const title = block.uiElement.mainTitle?.title || '私人订制'
      const subTitle = block.uiElement.subTitle?.title || ''
      data.customSonglist = {
        title,
        subTitle,
        data: block.creatives || []
      }
    } else if (block.blockCode === 'HOMEPAGE_BLOCK_OFFICIAL_PLAYLIST') {
      data.officalPlaylist = {
        title: '专属场景歌单',
        data: dealPlaylistData(block)
      }
    }
  }
  return data
}

// type:资源类型,对应以下类型,默认为 0 即PC
// 0: pc
// 1: android
// 2: iphone
// 3: ipad
export function getBannerList() {
  return request<BannerData>('/banner', 'get', { type: 1 })
}

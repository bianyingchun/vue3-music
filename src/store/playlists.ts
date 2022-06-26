import { defineStore } from 'pinia'

import { CategoryList, Playlist, Tag, Playlist2, Track } from '@/types'
import {
  getCatlist,
  getHqTaglist,
  getPlaylistDetail,
  subscribePlaylist,
  updatePlaylistTracks,
  createPlaylist,
  deletePlaylist
} from '@/common/api/playlist'
import { getUserPlaylist, getlikelistIds } from '@/common/api/user'
import { likeSong } from '@/common/api/song'
import { showToast } from '@/plugin/toast'
import useAuthStore from './auth'

const usePlaylistsStore = defineStore('playlists', {
  state: () => ({
    list: [] as Track[],
    hqTags: [] as Tag[],
    catlist: [] as CategoryList[],
    detail: null as Playlist2 | null,
    mine: {
      faved: [] as Playlist[],
      created: [] as Playlist[],
      likelist: null as Playlist | null,
      likelistIds: [] as number[]
    },
    squareTags: [
      { name: '推荐', fixed: true },
      { name: '官方', fixed: true },
      { name: '精品', fixed: true },
      { name: '流行', hot: true },
      { name: '轻音乐', hot: true },
      { name: '电子', hot: true },
      { name: '韩语' }
    ],
    posting: false,
    loading: false
  }),
  actions: {
    async getPlaylistCatlist() {
      try {
        const list = await getCatlist()
        this.catlist = list
      } catch (err) {
        showToast('请求失败')
      }
    },
    async getHqTaglist() {
      try {
        const res = await getHqTaglist()
        this.hqTags = res.data.tags
      } catch (err) {
        showToast('请求失败')
      }
    },
    async fetchPlaylist(mineId: number) {
      if (typeof mineId == 'undefined') return
      try {
        const { created, faved, likelist } = await getUserPlaylist(mineId)
        this.mine.likelist = likelist
        this.mine.created = created
        this.mine.faved = faved
      } catch (err) {
        console.log(err)
      }
    },
    async fetchLikelistIds(mineId: number) {
      if (!mineId) return
      try {
        this.mine.likelistIds = await getlikelistIds(mineId)
      } catch (err) {
        console.log(err)
      }
    },
    async fetchDetail(id: number) {
      if (this.loading) return
      try {
        this.loading = true
        const res = await getPlaylistDetail(id)
        this.detail = res.data.playlist
      } catch (err) {
        showToast('加载失败')
      } finally {
        this.loading = false
      }
    },
    async toggleSubscribe(payload: {
      playlist: Playlist
      subscribed: boolean
    }) {
      if (this.posting) return
      try {
        this.posting = true
        const { subscribed, playlist } = payload
        const pid = playlist.id
        await subscribePlaylist(pid, subscribed)
        if (this.detail && this.detail.id === pid) {
          this.detail.subscribed = subscribed
        }
        const list = this.mine.faved
        if (subscribed) {
          list.unshift({ ...playlist, subscribed })
        }
        const index = list.findIndex(item => item.id === pid)
        if (index !== -1) {
          list.splice(index, 1)
        }
      } catch (err) {
        showToast(payload.subscribed ? '收藏失败' : '取消收藏失败')
      } finally {
        this.posting = false
      }
    },
    async toggleLikeSong(payload: { id: number; like: boolean }) {
      const auth = useAuthStore()
      if (!auth.account || this.posting) return
      try {
        this.posting = true
        const res = await likeSong(payload.id, payload.like)
        if (res.data.code === 200) {
          if (payload.like) {
            this.mine.likelistIds.push(payload.id)
          } else {
            const list = this.mine.likelistIds
            const index = list.indexOf(payload.id)
            list.splice(index, 1)
          }
        }
      } catch (err) {
        showToast('请求失败')
      } finally {
        this.posting = false
      }
    },
    async deleteTrack(payload: { pid: number; track: Track }) {
      if (this.posting) return
      let message = ''
      try {
        this.posting = true
        const { pid, track } = payload
        const res = await updatePlaylistTracks(pid, track.id, 'del')
        if (res.data.body.code !== 200) {
          message = res.data.body.message
        } else {
          if (this.detail && this.detail.id === pid) {
            const tracks = this.detail.tracks
            const index = tracks.findIndex(item => item.id === track.id)
            tracks.splice(index, 1)
          }
          const list = this.mine.created
          const index = list.findIndex(item => item.id === pid)
          if (index !== -1) {
            list[index].trackCount--
          }
        }
      } catch (err) {
        message = '删除失败'
      } finally {
        this.posting = false
        showToast(message || '已从歌单中删除')
      }
    },
    async addTrack(payload: { pid: number; track: Track }) {
      if (this.posting) return
      let message = ''
      try {
        this.posting = true
        const { pid, track } = payload
        const res = await updatePlaylistTracks(pid, track.id, 'add')
        if (res.data.body.code != 200) {
          message = res.data.body.message
        } else {
          if (this.detail && this.detail.id === pid) {
            this.detail.tracks.push(track)
          }
          const list = this.mine.created
          const index = list.findIndex(item => item.id === pid)
          if (index !== -1) {
            list[index].trackCount++
          }
        }
      } catch (err) {
        message = '添加失败'
      } finally {
        this.posting = false
        showToast(message || '已添加到到歌单')
      }
    },
    async addPlaylist(info: { name: string; privacy: boolean }) {
      try {
        const res = await createPlaylist(info)
        if (res.data.playlist) {
          this.mine.created.unshift(res.data.playlist)
        } else {
          showToast('创建失败')
        }
      } catch (err) {
        showToast('创建失败')
      }
    },
    async deletePlaylist(pid: number) {
      if (this.posting) return
      let message = ''
      try {
        this.posting = true
        const res = await deletePlaylist(pid)
        if (res.data.code === 200) {
          const list = this.mine.created
          const index = list.findIndex(item => item.id === pid)
          if (index !== -1) {
            list.splice(index, 1)
          }
        } else {
          message = res.data.message || '删除失败'
        }
      } catch (err) {
        message = '删除失败'
      } finally {
        this.posting = false
        showToast(message || '已删除歌单')
      }
    },
    clearUserPlaylist() {
      this.mine = {
        faved: [] as Playlist[],
        created: [] as Playlist[],
        likelist: null as Playlist | null,
        likelistIds: [] as number[]
      }
    },
    addSquareTag(item: Tag) {
      this.squareTags.push(item)
    },
    deleteSquareTag(index: number) {
      this.squareTags.splice(index, 1)
    }
  }
})

export default usePlaylistsStore

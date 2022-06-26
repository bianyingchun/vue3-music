import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import usePlaylistsStore from '@/store/playlists'
import useAuthStore from '@/store/auth'
import { Playlist, Track } from '@/types'
import { popup } from '@/plugin/popup'

export function usePlaylist() {
  const store = usePlaylistsStore()
  const { detail: playlist } = storeToRefs(store)

  function getPlaylistDetail(id: number) {
    store.fetchDetail(id)
  }
  async function toggleSubscribe(playlist: Playlist) {
    if (playlist.subscribed) {
      await popup('确定不再收藏此歌单吗')
      store.toggleSubscribe({
        playlist,
        subscribed: false
      })
    } else {
      store.toggleSubscribe({
        playlist,
        subscribed: true
      })
    }
  }

  function checkIsSelf(playlist: Playlist) {
    const store = useAuthStore()
    const account = store.account
    return account && playlist.creator && playlist.creator.userId === account.id
  }
  return {
    playlist,
    getPlaylistDetail,
    toggleSubscribe,
    checkIsSelf
  }
}

export function useMylist() {
  const store = usePlaylistsStore()
  const createdList = computed(() => store.mine.created)
  const favedList = computed(() => store.mine.faved)
  const likelist = computed(() => store.mine.likelist)

  function addTrack(pid: number, track: Track) {
    store.addTrack({ pid, track })
    // showToast(message || '已添加到到歌单')
  }
  async function deleteTrack(pid: number, track: Track) {
    await popup('确定将所选音乐从音乐列表中删除？')
    await store.deleteTrack({
      pid,
      track
    })
  }
  async function deletePlaylist(pid: number) {
    await popup('确定删除歌单？')
    await store.deletePlaylist(pid)
    // showToast(message || '已删除歌单')
  }
  return {
    likelist,
    favedList,
    createdList,
    addTrack,
    deleteTrack,
    deletePlaylist
  }
}

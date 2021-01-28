import { computed } from 'vue'
import { Store } from 'vuex'
import { GlobalState, Playlist, Track } from '@/types'
import { popup } from '@/plugin/popup'
export function usePlaylist(store: Store<GlobalState>) {
  const playlist = computed(() => store.state.playlists.detail)

  function getPlaylistDetail(id: number) {
    store.dispatch('playlists/fetchDetail', id)
  }
  async function toggleSubscribe(playlist: Playlist) {
    if (playlist.subscribed) {
      await popup('确定不再收藏此歌单吗')
      await store.dispatch('playlists/toggleSubscribe', {
        playlist,
        subscribed: false
      })
    } else {
      await store.dispatch('playlists/toggleSubscribe', {
        playlist,
        subscribed: true
      })
    }
  }
  function checkIsSelf(playlist: Playlist) {
    const account = store.state.auth.account
    return account && playlist.creator && playlist.creator.userId === account.id
  }
  return {
    playlist,
    getPlaylistDetail,
    toggleSubscribe,
    checkIsSelf
  }
}

export function useMylist(store: Store<GlobalState>) {
  const createdList = computed(() => store.state.playlists.mine.created)
  const favedList = computed(() => store.state.playlists.mine.faved)
  const likelist = computed(() => store.state.playlists.mine.likelist)

  function addTrack(pid: number, track: Track) {
    store.dispatch('playlists/addTrack', {
      pid,
      track
    })
    // showToast(message || '已添加到到歌单')
  }
  async function deleteTrack(pid: number, track: Track) {
    await popup('确定将所选音乐从音乐列表中删除？')
    await store.dispatch('playlists/deleteTrack', {
      pid,
      track
    })

    // showToast(message || '已从歌单中删除')
  }
  async function deletePlaylist(pid: number) {
    await popup('确定删除歌单？')
    await store.dispatch('playlists/deletePlaylist', pid)
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

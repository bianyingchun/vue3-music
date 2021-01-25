import { Module } from 'vuex'
import * as Types from '../action-types'
import {
  CategoryList,
  GlobalState,
  PlaylistsState,
  Playlist,
  Tag,
  Playlist2,
  Track
} from '@/types'

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
// import { showToast } from '@/plugin/toast'
const state: PlaylistsState = {
  list: [],
  hqTags: [],
  catlist: [],
  detail: null,
  mine: {
    created: [],
    faved: [],
    likelist: null,
    likelistIds: []
  },
  posting: false,
  loading: false
}

const playlists: Module<PlaylistsState, GlobalState> = {
  namespaced: true,
  state: state,
  mutations: {
    [Types.SET_PLAYLIST_CATLIST](state, payload: CategoryList[]) {
      state.catlist = payload
    },
    [Types.SET_HQ_TAGLIST](state, payload: Tag[]) {
      state.hqTags = payload
    },
    [Types.SET_PLAYLIST_DETAIL](state, payload: Playlist2 | null) {
      state.detail = payload
    },
    [Types.SET_CREATED_PLAYLIST](state, list: Playlist[]) {
      state.mine.created = list
    },
    [Types.SET_FAVED_PLAYLIST](state, list: Playlist[]) {
      state.mine.faved = list
    },
    [Types.SET_USER_LIKELIST](state, list: Playlist | null) {
      state.mine.likelist = list
    },
    [Types.SET_USER_LIKELISTIDS](state, list: number[]) {
      state.mine.likelistIds = list
    },
    [Types.SET_PLAYLIST_LOADING](state, loading: boolean) {
      state.loading = loading
    }
  },
  actions: {
    async [Types.SET_PLAYLIST_CATLIST]({ commit }) {
      const list = await getCatlist()
      commit(Types.SET_PLAYLIST_CATLIST, list)
    },
    async [Types.SET_HQ_TAGLIST]({ commit }) {
      const res = await getHqTaglist()
      commit(Types.SET_HQ_TAGLIST, res.data.tags)
    },
    async fetchPlaylist({ commit }, mineId: number) {
      if (!mineId) return
      const { created, faved, likelist } = await getUserPlaylist(mineId)
      commit(Types.SET_USER_LIKELIST, likelist)
      commit(Types.SET_CREATED_PLAYLIST, created)
      commit(Types.SET_FAVED_PLAYLIST, faved)
    },
    async fetchLikelistIds({ commit }, mineId: number) {
      if (!mineId) return
      const ids = await getlikelistIds(mineId)
      commit(Types.SET_USER_LIKELISTIDS, ids)
    },
    async fetchDetail({ state, commit }, id: number) {
      if (state.loading) return
      commit(Types.SET_PLAYLIST_LOADING, true)
      const res = await getPlaylistDetail(id)
      commit(Types.SET_PLAYLIST_DETAIL, res.data.playlist)
      commit(Types.SET_PLAYLIST_LOADING, false)
    },
    async toggleSubscribe(
      { state, commit },
      payload: { playlist: Playlist; subscribed: boolean }
    ) {
      if (state.posting) return
      commit(Types.SET_PLAYLIST_LOADING, true)
      const { subscribed, playlist } = payload
      const pid = playlist.id
      await subscribePlaylist(pid, !subscribed)
      if (state.detail && state.detail.id === pid) {
        commit(Types.SET_PLAYLIST_DETAIL, {
          ...state.detail,
          subscribed
        })
      }
      const list = state.mine.faved.slice()
      if (subscribed) {
        list.unshift({ ...playlist, subscribed })
      }
      const index = list.findIndex(item => item.id === pid)
      if (index !== -1) {
        list.splice(index, 1)
        commit(Types.SET_FAVED_PLAYLIST, list)
      }
      commit(Types.SET_PLAYLIST_LOADING, false)
    },
    async toggleLikeSong(
      { state, commit, rootState },
      payload: { id: number; like: boolean }
    ) {
      if (!rootState.auth.account) return
      commit(Types.SET_POSTING, true)
      const res = await likeSong(payload.id, payload.like)
      if (res.data.code === 200) {
        if (payload.like) {
          commit(Types.SET_USER_LIKELISTIDS, [
            ...state.mine.likelistIds,
            payload.id
          ])
        } else {
          const list = state.mine.likelistIds.slice()
          const index = list.indexOf(payload.id)
          list.splice(index, 1)
          commit(Types.SET_USER_LIKELISTIDS, list)
        }
      }
      commit(Types.SET_POSTING, false)
    },
    async deleteTrack(
      { state, commit },
      payload: { pid: number; track: Track }
    ) {
      const { pid, track } = payload
      const res = await updatePlaylistTracks(pid, track.id, 'del')
      if (res.data.body.code !== 200) {
        return res.data.body.message
      }
      if (state.detail && state.detail.id) {
        const tracks = state.detail.tracks.slice()
        const index = tracks.findIndex(item => item.id === track.id)
        tracks.splice(index, 1)
        commit(Types.SET_PLAYLIST_DETAIL, {
          ...state.detail,
          tracks
        })
      }
      const list = state.mine.created.slice()
      const index = list.findIndex(item => item.id === pid)
      if (index !== -1) {
        list[index].playCount--
        commit(Types.SET_CREATED_PLAYLIST, list)
      }
      commit(Types.SET_PLAYLIST_LOADING, false)
    },
    async addTrack({ state, commit }, payload: { pid: number; track: Track }) {
      const { pid, track } = payload
      const res = await updatePlaylistTracks(pid, track.id, 'add')
      if (res.data.body.code != 200) {
        return res.data.body.message
      }
      if (state.detail && state.detail.id) {
        const tracks = [track, ...state.detail.tracks]
        commit(Types.SET_PLAYLIST_DETAIL, {
          ...state.detail,
          tracks
        })
      }
      const list = state.mine.created.slice()
      const index = list.findIndex(item => item.id === pid)
      if (index !== -1) {
        list[index].playCount++
        commit(Types.SET_CREATED_PLAYLIST, list)
      }
      commit(Types.SET_PLAYLIST_LOADING, false)
    },
    async addPlaylist(
      { commit, state },
      info: { name: string; privacy: boolean }
    ) {
      const res = await createPlaylist(info)
      if (res.data.playlist) {
        commit(Types.SET_CREATED_PLAYLIST, [
          res.data.playlist,
          ...state.mine.created
        ])
      }
    },
    async deletePlaylist({ state, commit }, pid: number) {
      const res = await deletePlaylist(pid)
      if (res.data.code === 200) {
        const list = state.mine.created.slice()
        const index = list.findIndex(item => item.id === pid)
        if (index !== -1) {
          list.splice(index, 1)
          commit(Types.SET_CREATED_PLAYLIST, list)
        }
      }
    },
    clearUserPlaylist({ commit }) {
      commit(Types.SET_CREATED_PLAYLIST, [])
      commit(Types.SET_FAVED_PLAYLIST, [])
      commit(Types.SET_USER_LIKELIST, null)
      commit(Types.SET_USER_LIKELISTIDS, [])
    }
  }
}

export default playlists

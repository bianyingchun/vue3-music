import { ParsedLyricData } from './../../types/song'
import { Module } from 'vuex'
import { shuffle } from 'lodash'
import { Track } from '@/types'
import { PlayMode, PlayerState, GlobalState } from '@/types'
import * as Types from '../action-types'
import { loadPlay, savePlay } from '@/common/js/cache'
import { getLyric } from '@/common/api/song'
import { PLAY_MODE_LIST } from '@/common/js/config'
const findIndex = (list: Track[], song: Track) =>
  list.findIndex(item => item.id === song.id)

const state: PlayerState = {
  playList: [],
  fullScreen: false,
  sequenceList: [],
  currentIndex: 0,
  mode: PlayMode.sequence,
  playing: false,
  playHistory: loadPlay(),
  currentTime: 0,
  lyric: {
    data: {},
    currentIndex: 0,
    fetching: false
  }
}

const playerModule: Module<PlayerState, GlobalState> = {
  namespaced: true,
  state: state,
  mutations: {
    [Types.SET_PLAYING_STATE](state, flag: boolean) {
      state.playing = flag
    },
    [Types.SET_PLAYLIST](state, list: Track[]) {
      state.playList = list
    },
    [Types.SET_SEQUENCE_LIST](state, list: Track[]) {
      state.sequenceList = list
    },
    [Types.SET_PLAYER_SCREEN](state, payload: boolean) {
      state.fullScreen = payload
    },
    [Types.SET_PLAY_MODE](state, mode: PlayMode) {
      state.mode = mode
    },
    [Types.SET_CURRENT_INDEX](state, index: number) {
      state.currentIndex = index
    },
    [Types.SET_PLAY_HISTORY](state, history: Track[]) {
      state.playHistory = history
    },
    [Types.SET_LYRIC_DATA](state, data: ParsedLyricData) {
      state.lyric.data = data
    },
    [Types.SET_LYRIC_FETCHING](state, payload: boolean) {
      state.lyric.fetching = payload
    },
    [Types.SET_CURRENT_TIME](state, payload: number) {
      state.currentTime = payload
    },
    [Types.SET_LYRIC_INDEX](state, index: number) {
      state.lyric.currentIndex = index
    }
  },
  actions: {
    clear({ commit }) {
      commit(Types.SET_PLAYLIST, [])
      commit(Types.SET_SEQUENCE_LIST, [])
    },
    async fetchLyric({ commit, state }, id: string | number) {
      if (state.lyric.fetching) return
      commit(Types.SET_LYRIC_FETCHING, true)
      try {
        const res = await getLyric(id)
        commit(Types.SET_LYRIC_DATA, res)
        commit(Types.SET_LYRIC_INDEX, 0)
      } catch (err) {
        console.log('get lyric failed')
      } finally {
        commit(Types.SET_LYRIC_FETCHING, false)
      }
    },
    selectPlay({ commit, state }, { list, index }) {
      if (list === state.sequenceList && index === state.currentIndex)
        return commit(Types.SET_PLAYER_SCREEN, true)
      commit(Types.SET_SEQUENCE_LIST, list)
      if (state.mode === PlayMode.random) {
        const randomList = shuffle(list)
        commit(Types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
      } else {
        commit(Types.SET_PLAYLIST, list)
      }
      commit(Types.SET_CURRENT_INDEX, index)
      commit(Types.SET_PLAYING_STATE, true)
    },
    randomPlay({ commit }, list: Track[]) {
      commit(Types.SET_PLAY_MODE, PlayMode.random)
      commit(Types.SET_SEQUENCE_LIST, list)
      const randomList = shuffle(list)
      commit(Types.SET_PLAYLIST, randomList)
      commit(Types.SET_CURRENT_INDEX, 0)
      commit(Types.SET_PLAYING_STATE, true)
    },
    insertSong({ commit, state }, song: Track) {
      const playList = state.playList.slice()
      const sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      // 记录当前歌曲
      const currentSong = playList[currentIndex]
      // 查找当前列表中是否有待插入的歌曲并返回其索引
      const fpIndex = findIndex(playList, song)
      // 因为是插入歌曲，所以索引+1
      currentIndex++
      // 插入这首歌到当前索引位置
      playList.splice(currentIndex, 0, song)
      // 如果已经包含了这首歌
      if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
          playList.splice(fpIndex, 1)
          currentIndex--
        } else {
          playList.splice(fpIndex + 1, 1)
        }
      }
      const currentSIndex = findIndex(sequenceList, currentSong) + 1
      const fsIndex = findIndex(sequenceList, song)
      sequenceList.splice(currentSIndex, 0, song)
      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }
      commit(Types.SET_PLAYLIST, playList)
      commit(Types.SET_SEQUENCE_LIST, sequenceList)
      commit(Types.SET_CURRENT_INDEX, currentIndex)
      commit(Types.SET_PLAYING_STATE, true)
    },
    deleteSong({ commit, state }, song) {
      const playList = state.playList.slice()
      const sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      const pIndex = findIndex(playList, song)
      playList.splice(pIndex, 1)
      const sIndex = findIndex(sequenceList, song)
      sequenceList.splice(sIndex, 1)
      if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
      }
      commit(Types.SET_PLAYLIST, playList)
      commit(Types.SET_SEQUENCE_LIST, sequenceList)
      commit(Types.SET_CURRENT_INDEX, currentIndex)
      if (!playList.length) {
        commit(Types.SET_PLAYING_STATE, false)
      } else {
        commit(Types.SET_PLAYING_STATE, true)
      }
    },
    playSong({ commit, state }, song) {
      const index = state.playList.findIndex(item => item.id === song.id)
      commit(Types.SET_CURRENT_INDEX, index)
    },
    savePlayHistory({ commit }, song) {
      commit(Types.SET_PLAY_HISTORY, savePlay(song))
    },
    playNext({ commit, state }) {
      let index = state.currentIndex + 1
      index = index === state.playList.length ? 0 : index
      commit(Types.SET_CURRENT_INDEX, index)
    },
    playPrev({ commit, state }) {
      let index = state.currentIndex - 1
      index = index < 0 ? state.playList.length - 1 : index
      commit(Types.SET_CURRENT_INDEX, index)
    },
    updateTime({ commit, state }, time) {
      commit(Types.SET_CURRENT_TIME, time)
      if (state.lyric.data.lrc) {
        for (let i = 0; i < state.lyric.data.lrc.length; i++) {
          const item = state.lyric.data.lrc[i]
          // console.log(item.time, time)
          if (item.time * 1000 >= time) {
            commit(Types.SET_LYRIC_INDEX, Math.max(0, i - 1))
            break
          }
        }
      }
    },
    togglePlayMode({ commit, state }) {
      const mode = (state.mode + 1) % PLAY_MODE_LIST.length
      if (mode === PlayMode.random) {
        const randomList = shuffle(state.playList)
        commit(Types.SET_PLAYLIST, randomList)
      }
      commit(Types.SET_PLAY_MODE, mode)
    }
  },
  getters: {
    currentMode: state => PLAY_MODE_LIST[state.mode] || {},
    currentSong: state => state.playList[state.currentIndex] || {},
    currentLyric: state => {
      if (state.lyric.data.lrc) {
        const item = state.lyric.data.lrc[state.lyric.currentIndex]
        return item.value
      }
      return ''
    }
  }
}

export default playerModule

import { defineStore } from 'pinia'
import { shuffle } from 'lodash'
import { Track, ParsedLyricData } from '@/types'
import { PlayMode } from '@/types'
import { loadPlay, savePlay } from '@/common/js/cache'
import { getLyric } from '@/common/api/song'
import { PLAY_MODE_LIST } from '@/common/js/config'
import { showToast } from '@/plugin/toast'

const findIndex = (list: Track[], song: Track) =>
  list.findIndex(item => item.id === song.id)

const usePlayerStore = defineStore('player', {
  state: () => ({
    playList: [] as Track[],
    fullScreen: false,
    sequenceList: [] as Track[],
    currentIndex: 0,
    mode: PlayMode.sequence,
    playing: false,
    playHistory: loadPlay() as Track[],
    currentTime: 0,
    lyric: {
      data: {} as ParsedLyricData,
      currentIndex: 0,
      fetching: false
    }
  }),
  actions: {
    clear() {
      this.playList = []
      this.sequenceList = []
    },
    async fetchLyric(id: string | number) {
      if (this.lyric.fetching) return
      this.lyric.fetching = true
      try {
        const res = await getLyric(id)
        this.lyric.data = res
        this.lyric.currentIndex = 0
      } catch (err) {
        showToast('get lyric failed')
      } finally {
        this.lyric.fetching = false
      }
    },
    selectPlay(list: Track[], index: number) {
      if (list === this.sequenceList && index === this.currentIndex)
        this.fullScreen = true
      this.sequenceList = list
      if (this.mode === PlayMode.random) {
        const randomList = shuffle(list)
        this.playList = randomList
        index = findIndex(randomList, list[index])
      } else {
        this.playList = list
      }
      this.currentIndex = index
      this.playing = true
    },
    randomPlay(list: Track[]) {
      this.mode = PlayMode.random
      this.sequenceList = list
      const randomList = shuffle(list)
      this.playList = randomList
      this.currentIndex = 0
    },
    insertSong(song: Track) {
      const playList = this.playList.slice()
      const sequenceList = this.sequenceList.slice()
      let currentIndex = this.currentIndex
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
      this.playList = playList
      this.sequenceList = sequenceList
      this.currentIndex = currentIndex
      this.playing = true
    },
    deleteSong(song: Track) {
      const playList = this.playList.slice()
      const sequenceList = this.sequenceList.slice()
      let currentIndex = this.currentIndex
      const pIndex = findIndex(playList, song)
      playList.splice(pIndex, 1)
      const sIndex = findIndex(sequenceList, song)
      sequenceList.splice(sIndex, 1)
      if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
      }
      this.playList = playList
      this.sequenceList = sequenceList
      this.currentIndex = currentIndex
      this.playing = !!playList.length
    },
    playSong(song: Track) {
      const index = this.playList.findIndex(item => item.id === song.id)
      this.currentIndex = index
      console.log('playsong', index)
    },
    savePlayHistory(song: Track) {
      this.playHistory = savePlay(song) as Track[]
    },
    playNext() {
      const index = this.currentIndex + 1
      this.currentIndex = index === this.playList.length ? 0 : index
      console.log('playnext', index, this.currentIndex, this.playList.length)
    },
    playPrev() {
      const index = this.currentIndex - 1
      this.currentIndex = index < 0 ? this.playList.length - 1 : index
      console.log('playprev', index, this.currentIndex, this.playList.length)
    },
    updateTime(time: number) {
      this.currentTime = time
      if (this.lyric.data.lrc) {
        for (let i = 0; i < this.lyric.data.lrc.length; i++) {
          const item = this.lyric.data.lrc[i]
          // console.log(item.time, time)
          if (item.time * 1000 >= time) {
            this.lyric.currentIndex = Math.max(0, i - 1)
            return
          }
        }
      }
    },
    togglePlayMode() {
      const mode = (this.mode + 1) % PLAY_MODE_LIST.length
      if (mode === PlayMode.random) {
        const randomList = shuffle(this.playList)
        this.playList = randomList
      }
      this.mode = mode
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
})

export default usePlayerStore

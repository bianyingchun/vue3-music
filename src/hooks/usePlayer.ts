import { computed, ref, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'

import usePlayerStore from '@/store/player'
import usePlaylistsStore from '@/store/playlists'
import useAuthStore from '@/store/auth'
import { PlayMode, Track } from '@/types'
import { showToast } from '@/plugin/toast'
import { checkSong } from '@/common/api/song'
import { popup } from '@/plugin/popup'

function getSource(id: number) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

export function usePlayer() {
  const audio = ref<HTMLAudioElement | null>(null)

  const store = usePlayerStore()
  const {
    currentIndex,
    currentSong,
    sequenceList,
    playList,
    playing,
    currentTime,
    lyric,
    mode,
    currentMode,
    currentLyric,
    fullScreen
  } = storeToRefs(store)
  watch(
    () => currentIndex.value,
    () => {
      console.log('------', currentIndex.value)
    }
  )
  const singerName = computed(() =>
    currentSong.value.ar.map((item: any) => item.name).join('/')
  )
  const playlistStore = usePlaylistsStore()
  // like
  const isliked = computed(() => {
    const likelist = playlistStore.mine.likelistIds
    if (!likelist) return
    return likelist.indexOf(currentSong.value.id) !== -1
  })
  function toggleLike(like: boolean) {
    return playlistStore.toggleLikeSong({
      id: currentSong.value.id,
      like
    })
  }

  const percent = computed(() => {
    const t = currentTime.value / currentSong.value.dt
    return t
  })
  const cachePercent = ref(0)
  function onUpdateTime() {
    const element = audio.value
    if (element) {
      store.updateTime(element.currentTime * 1000)
      if (element.buffered.length) {
        const cacheTime = element.buffered.end(element.buffered.length - 1)
        cachePercent.value = (cacheTime * 10000) / (element.duration * 10000)
      } else {
        cachePercent.value = 0
      }
    }
  }
  function setTime(t: number) {
    const element = audio.value as HTMLAudioElement
    element.currentTime = t
  }
  function onPercentChange(value: number) {
    const t = currentSong.value.dt * value
    setTime(t / 1000)
    store.updateTime(t)
  }

  function pause() {
    const element = audio.value as HTMLAudioElement
    element.pause()
  }
  const authStore = useAuthStore()
  const account = authStore.account
  function play() {
    const element = audio.value
    if (currentSong.value.id && element) {
      nextTick(() => {
        const playPromise = element.play()
        if (playPromise) {
          playPromise
            .then(res => {
              console.log(res)
            })
            .catch(async () => {
              // 音频加载失败
              if (currentSong.value.fee === 1 && !account?.paidFee) {
                showToast('开通 vip 畅听')
                return pause()
              }
              try {
                await checkSong(currentSong.value.id)
              } catch (err) {
                showToast('亲爱的,暂无版权')
                return pause()
              }
              showToast('播放失败')
            })
        }
      })
    }
  }
  function playSong(song: Track) {
    const element = audio.value as HTMLAudioElement
    element.src = getSource(song.id)
    store.fetchLyric(song.id)
    play()
  }

  function changeMode() {
    store.togglePlayMode()
  }

  function next() {
    setTime(0)
    store.playNext()
  }

  function prev() {
    setTime(0)
    store.playPrev()
  }
  function loop() {
    setTime(0)
    play()
  }
  function onEnd() {
    if (mode.value === PlayMode.loop) {
      loop()
    } else {
      next()
    }
  }

  function _savePlayHistory() {
    store.savePlayHistory(currentSong.value)
  }

  function onPause() {
    store.playing = false
  }
  function onPlay() {
    store.playing = true
    _savePlayHistory()
  }
  function togglePlay() {
    if (playing.value) {
      pause()
    } else {
      play()
    }
  }
  function setCurrentSong(song: Track) {
    store.playSong(song)
  }
  function deleteSong(song: Track) {
    store.deleteSong(song)
  }
  function clearSong() {
    popup('确认清空播放列表？')
      .then(() => {
        store.clear()
      })
      .catch()
  }
  function onError() {
    showToast('播放失败')
    pause()
    setTime(0)
  }

  function toggleFullScreen(payload: boolean) {
    store.fullScreen = payload
  }
  return {
    fullScreen,
    toggleFullScreen,
    currentSong,
    currentLyric,
    singerName,
    playList,
    sequenceList,
    playing,
    togglePlay,
    percent,
    currentTime,
    onUpdateTime,
    onPercentChange,
    audio,
    pause,
    play,
    playSong,
    mode: currentMode,
    changeMode,
    next,
    prev,
    onPause,
    onEnd,
    onPlay,
    onError,
    lyric,
    isliked,
    toggleLike,
    deleteSong,
    clearSong,
    setCurrentSong,
    cachePercent,
    setTime
  }
}

export function usePlayMusic() {
  const store = usePlayerStore()
  const { currentSong, playing } = storeToRefs(store)
  return {
    currentSong,
    insertSong: store.insertSong,
    selectPlay: store.selectPlay,
    playing
  }
}

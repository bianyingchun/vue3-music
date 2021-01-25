import { computed, ref, nextTick } from 'vue'
import { GlobalState, PlayMode, Track } from '@/types'
import { Store } from 'vuex'
import * as Types from '@/store/action-types'
import { showToast } from '@/plugin/toast'
import { checkSong } from '@/common/api/song'
import { popup } from '@/plugin/popup'

function getSource(id: number) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

export function usePlayer(store: Store<GlobalState>) {
  const audio = ref<HTMLAudioElement | null>(null)
  const currentSong = computed<Track>(() => store.getters['player/currentSong'])
  const playList = computed(() => store.state.player.playList)
  const sequenceList = computed(() => store.state.player.sequenceList)
  const singerName = computed(() =>
    currentSong.value.ar.map((item: any) => item.name).join('/')
  )
  // like
  const isliked = computed(() => {
    const likelist = store.state.playlists.mine.likelistIds
    if (!likelist) return
    return likelist.indexOf(currentSong.value.id) !== -1
  })
  function toggleLike(like: boolean) {
    return store.dispatch('playlists/toggleLikeSong', {
      id: currentSong.value.id,
      like
    })
  }
  // add to /remove from  playlist
  const playing = computed(() => store.state.player.playing)
  function setPlaying(value: boolean) {
    store.commit('player/' + Types.SET_PLAYING_STATE, value)
  }
  const currentTime = computed(() => store.state.player.currentTime)
  const percent = computed(() => {
    const t = currentTime.value / currentSong.value.dt
    return t
  })
  const cachePercent = ref(0)

  function onUpdateTime() {
    const element = audio.value
    if (element) {
      store.dispatch('player/updateTime', element.currentTime * 1000)
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
    store.dispatch('player/updateTime', t)
  }
  const lyric = computed(() => store.state.player.lyric)
  function pause() {
    const element = audio.value as HTMLAudioElement
    element.pause()
  }
  const account = computed(() => store.state.auth.account)
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
              if (currentSong.value.fee === 1 && !account.value?.paidFee) {
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
    store.dispatch('player/fetchLyric', song.id)
    play()
  }
  const mode = computed(() => store.getters['player/currentMode'])
  function changeMode() {
    store.dispatch('player/togglePlayMode')
  }

  function next() {
    setTime(0)
    store.dispatch('player/playNext')
  }

  function prev() {
    setTime(0)
    store.dispatch('player/playPrev')
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
    store.dispatch('player/savePlayHistory', currentSong.value)
  }

  function onPause() {
    setPlaying(false)
  }
  function onPlay() {
    setPlaying(true)
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
    store.dispatch('player/playSong', song)
  }
  function deleteSong(song: Track) {
    store.dispatch('player/deleteSong', song)
  }
  function clearSong() {
    popup('确认清空播放列表？')
      .then(() => {
        store.dispatch('player/clear')
      })
      .catch()
  }
  function onError() {
    showToast('播放失败')
    pause()
    setTime(0)
  }
  const currentLyric = computed(() => store.getters['player/currentLyric'])
  const fullScreen = computed(() => store.state.player.fullScreen)
  function toggleFullScreen(payload: boolean) {
    store.commit('player/' + Types.SET_PLAYER_SCREEN, payload)
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
    mode,
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
    cachePercent
  }
}

export function usePlayMusic(store: Store<GlobalState>) {
  const playing = computed(() => store.state.player.playing)
  const currentSong = computed(() => store.getters['player/currentSong'])
  function selectPlay(list: Track[], index: number) {
    store.dispatch('player/selectPlay', {
      list,
      index
    })
  }
  function insertSong(song: Track) {
    store.dispatch('player/insertSong', song)
  }
  return {
    currentSong,
    insertSong,
    selectPlay,
    playing
  }
}

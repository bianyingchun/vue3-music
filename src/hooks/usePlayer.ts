import { computed, ref, nextTick } from 'vue'
import { GlobalState, PlayMode } from '@/typing'
import { Track } from '@/typing/playlist'
import { Store } from 'vuex'
import * as Types from '@/store/action-types'

const audio = ref<HTMLAudioElement | null>(null)
function getSource(id: number) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}
export function usePlayer(store: Store<GlobalState>) {
  const currentSong = computed<Track>(() => store.getters['player/currentSong'])
  const playList = computed(() => store.state.player.playList)
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
  // add/remove playlist

  const playing = computed(() => store.state.player.playing)
  function setPlaying(value: boolean) {
    store.commit('player/' + Types.SET_PLAYING_STATE, value)
  }
  const currentTime = computed(() => store.state.player.currentTime)
  const percent = computed(() => {
    const t = currentTime.value / currentSong.value.dt
    return t
  })
  function onUpdateTime() {
    const element = audio.value as HTMLAudioElement
    store.dispatch('player/updateTime', element.currentTime * 1000)
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

  function play() {
    if (currentSong.value.id) {
      nextTick(() => {
        const element = audio.value as HTMLAudioElement
        if (!element) return
        const playPromise = element.play()
        if (playPromise) {
          playPromise
            .then(res => {
              console.log(res)
            })
            .catch(e => {
              // 音频加载失败
              console.log(e, '播放失败')
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
    setPlaying(true)
    store.dispatch('player/playNext')
  }

  function prev() {
    setPlaying(true)
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
  const currentLyric = computed(() => store.getters['player/currentLyric'])
  return {
    currentSong,
    currentLyric,
    singerName,
    playList,
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
    lyric,
    isliked,
    toggleLike
  }
}

export function usePlayMusic(store: Store<GlobalState>) {
  function selectPlay(list: Track[], index: number) {
    store.dispatch('player/selectPlay', {
      list,
      index
    })
  }
  function setCurrentSong(song: Track) {
    store.dispatch('player/playSong', song)
  }
  const currentSong = computed(() => store.getters['player/currentSong'])
  const sequenceList = computed(() => store.state.player.sequenceList)

  const mode = computed(() => store.getters['player/currentMode'])
  function changeMode() {
    store.dispatch('player/togglePlayMode')
  }
  return {
    selectPlay,
    currentSong,
    setCurrentSong,
    sequenceList,
    mode,
    changeMode
  }
}

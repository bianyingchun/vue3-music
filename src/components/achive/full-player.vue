<template></template>

<script lang="ts">
import { GlobalState } from '@/types'
import { defineComponent, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import ProgressBar from '@/components/widget/progress-bar.vue'
import { usePlayer } from '@/hooks/usePlayer'
import { favTrackToMix } from '@/hooks/useFavToMix'
import { showSongAr } from '@/hooks/useSongAr'
import PlayList from '@/components/achive/current-playlist.vue'
export default defineComponent({
    props:{
        currentSong:
        currentTime:number,
        singerName:
    },
  components: {
    ProgressBar,
  },
  setup() {
    const store = useStore<GlobalState>()
    const {
      currentSong,
      currentTime,
      singerName,
      playList,
      playing,
      togglePlay,
      percent,
      onPercentChange,
      changeMode,
      next,
      prev,
      mode,
      lyric,
      isliked,
      toggleLike
    } = usePlayer(store)
    function format(t: number) {
      t = Math.floor(t / 1000)
      let m: string | number = Math.floor(t / 60)
      let s: string | number = t % 60
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    }
    const showLyric = ref(false)
    function toggleShowLyric() {
      showLyric.value = !showLyric.value
    }

    let lyricHeightArr: number[] = []
    watch(
      () => lyric.value.data.lrc,
      () => {
        nextTick(() => {
          lyricHeightArr = []
          const ps = document.querySelectorAll('.lyric-item')
          let h = 0
          for (let i = 0; i < ps.length; i++) {
            lyricHeightArr.push(h)
            h += ps[i].clientHeight
          }
        })
      },
      {
        immediate: true
      }
    )
    watch(
      () => lyric.value.currentIndex,
      index => {
        const top = lyricHeightArr[index]
        const wraper = document.querySelector('.lyric-wraper')
        ;(wraper as HTMLElement).scrollTo({
          top,
          behavior: 'smooth'
        })
      }
    )
    const lyricTransY = ref(0)
    return {
      currentSong,
      playing,
      singerName,
      percent,
      onPercentChange,
      mode,
      changeMode,
      prev,
      next,
      togglePlay,
      playList,
      currentTime,
      format,
      showLyric,
      toggleShowLyric,
      lyric,
      lyricTransY,
      isliked,
      toggleLike,
      favTrackToMix,
      showSongAr
    }
  }
})
</script>

<style lang="scss" scoped>
</style>

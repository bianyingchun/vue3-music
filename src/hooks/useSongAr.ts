import { reactive, createApp, App, h } from 'vue'
import Comp from '@/components/achive/song-ar.vue'
import { Track, Ar } from '@/types'
import router from '@/router'

let songArInstance: App | null = null
const state = reactive<{
  show: boolean
  ar: Ar[]
}>({
  show: false,
  ar: []
})

function hide() {
  state.show = false
}
function onSelect(ar: Ar) {
  hide()
  router.push('/artist/' + ar.id)
}
export function showSongAr(song: Track) {
  const ar = song.ar
  if (ar.length === 1) {
    return router.push('/artist/' + ar[0].id)
  }
  state.show = true
  state.ar = song.ar

  if (!songArInstance) {
    songArInstance = createApp({
      setup() {
        return () =>
          h(Comp, {
            show: state.show,
            list: state.ar,
            hide,
            onSelect
          })
      }
    })
    const el = document.createElement('div')
    document.body.appendChild(el)
    songArInstance.mount(el)
  }
}
export function getSingerName(track: Track) {
  return track.ar.map((item: any) => item.name).join('/')
}
export function useSongAr() {
  return {
    getSingerName,
    showSongAr
  }
}

import { ref, createApp, App, h } from 'vue'
import Comp from '@/components/achive/fav-to-mix.vue'
import { useMylist } from './usePlaylist'
import { Track } from '@/typing/playlist'
import { Playlist } from '@/typing'
import store from '@/store'
let favToMixVm: App | null = null

const show = ref(false)
function hide() {
  show.value = false
}

export function favTrackToMix(track: Track) {
  show.value = true
  const { likelist, createdList, addTrack } = useMylist(store)
  const list = likelist.value
    ? [likelist.value, ...createdList.value]
    : createdList.value
  async function onSelect(mix: Playlist) {
    show.value = false
    await addTrack(mix.id, track)
  }
  if (!favToMixVm) {
    favToMixVm = createApp({
      setup() {
        return () =>
          h(Comp, {
            show: show.value,
            list,
            hide,
            onSelect
          })
      }
    })
    const el = document.createElement('div')
    document.body.appendChild(el)
    favToMixVm.mount(el)
  }
}

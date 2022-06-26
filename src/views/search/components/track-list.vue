<template>
  <div class="result-list" ref="refreshElem">
    <song-list :list="list" @select="onSelect" :currentItem="currentSong" />
    <div class="loading" v-if="loading">加载中</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import SongList from '@/components/achive/song-list.vue'
import { showToast } from '@/plugin/toast'
import { SearchTrackResult, SearchTypeVal, Track } from '@/types'
import { useLoadMore } from '@/hooks/useLoadMore'
import { usePlayMusic } from '@/hooks/usePlayer'
import { search } from '@/common/api/search'
import { transformTrack } from '@/common/js/music'
import { getSongDetail } from '@/common/api/song'

export default defineComponent({
  props: {
    active: Boolean,
    query: String
  },
  components: {
    SongList
  },
  setup(props) {
    let hasMore = true
    const loading = ref(false)
    const list = ref<Track[]>([])
    const { currentSong, insertSong } = usePlayMusic()
    async function onSelect(list: Track[], index: number) {
      try {
        const res = await getSongDetail([list[index].id])
        const track = res.data.songs[0]
        if (track) {
          insertSong(track)
        } else {
          throw new Error()
        }
      } catch (err) {
        showToast('播放失败')
      }
    }
    async function getList() {
      try {
        if (!hasMore || loading.value || !props.query) return
        loading.value = true
        const res = await search<SearchTrackResult>({
          keywords: props.query,
          type: SearchTypeVal.track
        })
        hasMore = res.data.result.hasMore
        const newList = res.data.result.songs.map(item => transformTrack(item))
        list.value = [...list.value, ...newList]
      } catch (err) {
        showToast('加载失败')
      } finally {
        loading.value = false
      }
    }
    const refreshElem = ref<HTMLDivElement | null>(null)
    useLoadMore(refreshElem, getList)
    watch(
      () => props.active,
      value => {
        if (value && !list.value.length) {
          getList()
        }
      },
      {
        immediate: true
      }
    )
    return {
      list,
      refreshElem,
      loading,
      onSelect,
      currentSong
    }
  }
})
</script>

<style lang="scss" scoped></style>

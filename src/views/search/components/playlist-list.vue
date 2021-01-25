<template>
  <div class="result-list" ref="refreshElem">
    <mix-item :mix="item" :key="item.id" v-for="item in list"></mix-item>
    <div class="loading" v-if="loading">加载中</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import MixItem from '@/components/achive/tiny-mix-item.vue'
import { showToast } from '@/plugin/toast'
import { Playlist3, SearchPlaylistResult, SearchTypeVal } from '@/types'
import { useLoadMore } from '@/hooks/useLoadMore'
import { search } from '@/common/api/search'
export default defineComponent({
  props: {
    active: Boolean,
    query: String
  },
  components: {
    MixItem
  },
  setup(props) {
    let hasMore = true
    const loading = ref(false)
    const list = ref<Playlist3[]>([])
    async function getList() {
      try {
        if (!hasMore || loading.value || !props.query) return
        loading.value = true
        const res = await search<SearchPlaylistResult>({
          keywords: props.query,
          type: SearchTypeVal.playlist
        })
        hasMore = res.data.result.hasMore
        list.value = [...list.value, ...res.data.result.playlists]
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
      () => {
        if (!list.value.length) {
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
      loading
    }
  }
})
</script>

<style lang="scss" scoped></style>

<template>
  <m-page title="全部歌曲">
    <template #default>
      <div class="scroller-container" ref="refreshElm">
        <song-list :list="list" :rank="true"> </song-list>
        <m-loading v-if="loading"></m-loading>
      </div>
    </template>
  </m-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getSongList } from '@/common/api/artist'
import SongList from '@/components/achive/song-list.vue'
import { useRoute } from 'vue-router'
import { Track } from '@/typing/playlist'
import { useLoadMore } from '@/hooks/useLoadMore'
import { usePage } from '@/hooks/usePage'

export default defineComponent({
  components: {
    SongList
  },
  setup() {
    const route = useRoute()
    const aid = Number(route.params.id)
    const order = ref<'hot' | 'time'>('hot')
    const list = ref<Track[]>([])
    async function getData(limit: number, offset: number) {
      const res = await getSongList(aid, {
        order: order.value,
        limit,
        offset
      })
      list.value = [...list.value, ...res.data.songs]
      return res.data.more
    }
    const { getList, loading, hasMore } = usePage(getData)
    const refreshElm = ref<null | HTMLElement>(null)
    useLoadMore(refreshElm, getList)
    getList()
    return {
      list,
      refreshElm,
      loading,
      hasMore
    }
  }
})
</script>
<style lang="scss" scoped></style>

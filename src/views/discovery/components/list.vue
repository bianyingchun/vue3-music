<template>
  <div class="container" ref="refreshElm">
    <div class="title" v-if="isHq">
      <div class="text">{{ tag }}</div>
      <div class="filter-btn" @click="$emit('showhq')">
        <span class="iconfont icon-add"></span>
        筛选
      </div>
    </div>
    <div class="mix-list">
      <mix-item
        v-for="(mix, index) in list"
        :key="index"
        :mix="mix"
        class="item"
      ></mix-item>
    </div>
    <m-loading v-if="loading"></m-loading>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { getTopPlaylist, getHqPlaylist } from '@/common/api/playlist'
import { Playlist } from '@/typing'
import MixItem from '@/components/achive/mix-item.vue'
import { useLoadMore } from '@/hooks/useLoadMore'

const LIMIT = 30
export default defineComponent({
  props: {
    name: String,
    tag: {
      type: String,
      default: '全部'
    }
  },
  components: {
    MixItem
  },
  setup(props) {
    const isHq = computed(() => props.name === '精品')
    const list = ref<Playlist[]>([])
    const hasMore = ref(true)
    const loading = ref(false)
    const page = ref(1)
    const before = ref(0)
    const offset = computed(() => (page.value - 1) * LIMIT)
    async function getList() {
      if (!hasMore.value || loading.value) return
      loading.value = true
      let res = null
      if (isHq.value) {
        res = await getHqPlaylist({
          limit: LIMIT,
          before: before.value,
          cat: props.tag
        })
        before.value =
          res.data.playlists[res.data.playlists.length - 1].updateTime
      } else {
        const name = props.name === '推荐' ? '全部' : props.name
        res = await getTopPlaylist(name, {
          limit: LIMIT,
          offset: offset.value
        })
      }
      hasMore.value = res.data.more
      loading.value = false
      page.value += 1

      list.value = [...list.value, ...res.data.playlists]
    }
    function refreshList() {
      loading.value = false
      hasMore.value = true
      list.value = []
      page.value = 0
      before.value = 0
      getList()
    }
    if (isHq.value) {
      watch(
        () => props.tag,
        () => {
          refreshList()
        }
      )
    }

    const refreshElm = ref<null | HTMLElement>(null)
    useLoadMore(refreshElm, getList)
    getList()
    return {
      list,
      loading,
      hasMore,
      refreshElm,
      isHq
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: $padding-lg;
  box-sizing: border-box;
  .mix-list {
    @include flex-list();
  }
  .title {
    display: flex;
    justify-content: space-between;
    padding-bottom: $padding-lg;
    .text {
      font-weight: 600;
      font-size: $font-size-lg;
    }
    .filter-btn {
      font-size: 12px;
      border: 1px solid #afafaf;
      border-radius: 13px;
      padding: 0 10px;
      line-height: 1;
      display: flex;
      align-items: center;
      .iconfont {
        margin-right: $gap-sm;
      }
    }
  }
}
</style>

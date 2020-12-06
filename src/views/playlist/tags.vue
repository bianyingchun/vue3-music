<template>
  <div class="playlist-tags">
    <div class="category-item" v-for="(item, index) in catlist" :key="index">
      <div class="title">{{ item.name }}</div>
      <div class="list">
        <div class="tag-item" v-for="tag in item.children" :key="tag.name">
          <i class="iconfont icon-hot" v-if="tag.hot">hot</i
          ><span class="text">{{ tag.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/typing'
import * as Types from '@/store/action-types'
export default defineComponent({
  setup() {
    const store = useStore<GlobalState>()
    const catlist = computed(() => {
      return store.state.playlists.catlist
    })
    onMounted(() => {
      if (!catlist.value.length) {
        store.dispatch(`playlists/${Types.SET_PLAYLIST_CATLIST}`)
      }
    })
    return {
      catlist
    }
  }
})
</script>

<style lang="scss" scoped>
.playlist-tags {
  .category-item {
    padding: $padding;
    .title {
      padding: $padding-lg 0;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      $tag-gap: $gap;
      $tag-item-count: 4;
      margin-right: -$tag-gap;
      .tag-item {
        width: calc(
          (100% - #{$tag-gap} * #{$tag-item-count}) / #{$tag-item-count}
        );
        margin-bottom: $tag-gap;
        margin-right: $tag-gap;
        i > {
          margin-right: $gap-xs;
        }
      }
    }
  }
}
</style>

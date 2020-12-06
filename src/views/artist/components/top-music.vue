<template>
  <div class="scroller-container hot-song-list">
    <div class="hot-songs">
      <song-list :list="list" :rank="true"></song-list>
    </div>
    <router-link
      class="more"
      v-if="more"
      :to="`/artist/${$route.params.id}/music`"
    >
      全部歌曲 <i class="iconfont icon-right"></i>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SongList from '@/components/achive/song-list.vue'
import { Track } from '@/typing/playlist'
export default defineComponent({
  components: {
    SongList
  },
  props: {
    more: Boolean,
    list: {
      type: Array as PropType<Track[]>,
      default: []
    }
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.more {
  padding: $padding;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
}
</style>

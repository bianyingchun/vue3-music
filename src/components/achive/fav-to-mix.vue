<template>
  <bottom-panel :show="show" @hide="hide()">
    <div class="fav-to-mix-container">
      <div class="header">收藏到歌单</div>
      <div class="mix-list">
        <mix-item
          v-for="item in list"
          :key="item.id"
          :mix="item"
          :isSelect="true"
          @select="onSelect(item)"
        ></mix-item>
      </div>
    </div>
  </bottom-panel>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import MixItem from './tiny-mix-item.vue'
import BottomPanel from '../widget/bottom-panel.vue'
import { Playlist } from '@/typing'
export default defineComponent({
  props: {
    show: Boolean,
    list: Array as PropType<Playlist[]>,
    hide: Function,
    onSelect: Function
  },
  components: {
    MixItem,
    BottomPanel
  }
})
</script>

<style lang="scss" scoped>
.fav-to-mix-container {
  .header {
    padding: $padding-lg;
  }
  .mix-list {
    overflow-y: auto;
    max-height: 60vh;
  }
}
</style>

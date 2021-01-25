<template>
  <modal v-if="show" @close="hide()">
    <div class="artist-container">
      <h3 class="title">请选择要查看的歌手</h3>
      <div
        class="artist-item"
        v-for="item in list"
        :key="item.id"
        @click="onSelect(item)"
      >
        <img :src="item" alt="" v-if="item.img1v1Url" />
        <span class="text">{{ item.name }}</span>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Modal from '../widget/modal.vue'
import { Ar } from '@/types'
export default defineComponent({
  props: {
    show: Boolean,
    list: Array as PropType<Ar[]>,
    onSelect: Function,
    hide: Function
  },
  components: {
    Modal
  }
})
</script>

<style lang="scss" scoped>
.artist-container {
  .title,
  .artist-item {
    padding: $padding $padding-lg;
    .text {
      @include text-overflow();
    }
  }
  .artist-item {
    img {
      margin-right: $gap;
    }
  }
}
</style>

<template>
  <div class="container" @click="hide" v-show="show">
    <div class="tool-tip-list" :class="theme">
      <div
        class="tool-item"
        v-for="(item, index) in list"
        :key="index"
        @click="item.action"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { TipItem } from './index.js'
import store from '@/store'
export default defineComponent({
  props: {
    list: Array as PropType<TipItem[]>,
    show: Boolean,
    hide: Function
  },
  setup() {
    const theme = computed(() => store.state.config.theme)
    return {
      theme: theme
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  .tool-tip-list {
    top: 50%;
    position: absolute;
    left: $padding;
    right: $padding;
    transform: translateY(-50%);
    border-radius: $border-radius;
    background: #fff;
    color: #333;
    .tool-item {
      padding: $padding-lg;
    }
    &.dark {
      background: #2c2c2c;
      color: #fff;
    }
  }
}
</style>

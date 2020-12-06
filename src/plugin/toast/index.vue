<template>
  <div
    class="wrap"
    v-show="showWrap"
    :class="[theme, showContent ? 'fadein' : 'fadeout']"
  >
    {{ text }}
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import store from '@/store'

export default defineComponent({
  props: {
    showWrap: Boolean,
    showContent: Boolean,
    text: String
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
.wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  background: $bg-reversal-opacity-9;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  transform: translate(-50%, -50%);
  color: $text-reversal;
  z-index: 9999;
  &.dark {
    background: rgba(255, 255, 255, 0.8);
    color: #333;
  }
  &.default {
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
  }
}
.fadein {
  animation: animate_in 0.25s;
}
.fadeout {
  animation: animate_out 0.25s;
  opacity: 0;
}
@keyframes animate_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes animate_out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

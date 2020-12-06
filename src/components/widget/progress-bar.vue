<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="{ width: `${progressWidth}px` }"
      ></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        :style="{ transform: `translate3d(${progressWidth}px, 0 , 0)` }"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
export default defineComponent({
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const touch = {
      initialed: false,
      starX: 0,
      left: 0
    }
    const selfPer = ref(props.percent)
    const progressBtnWidth = 16
    const progressBar = ref<null | HTMLElement>(null)
    const progress = ref<null | HTMLElement>(null)
    let barWidth = 0
    const progressWidth = computed(() => {
      return barWidth * selfPer.value
    })
    onMounted(() => {
      const e = progressBar.value as HTMLElement
      barWidth = e.clientWidth - progressBtnWidth
    })
    function progressTouchStart(e: TouchEvent) {
      touch.initialed = true
      touch.starX = e.touches[0].pageX
      const element = progress.value as HTMLElement
      touch.left = element.clientWidth
    }
    function progressTouchMove(e: TouchEvent) {
      if (!touch.initialed) return
      const deltaX = e.touches[0].pageX - touch.starX
      const width = Math.min(barWidth, Math.max(0, touch.left + deltaX))
      selfPer.value = width / barWidth
    }
    function progressTouchEnd() {
      touch.initialed = false
      emit('change', selfPer.value)
    }
    function progressClick(e: MouseEvent) {
      const rect = (progressBar.value as HTMLElement).getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      emit('change', offsetWidth / barWidth)
    }
    watch(
      () => props.percent,
      value => {
        selfPer.value = value
      }
    )
    return {
      progressTouchStart,
      progressTouchMove,
      progressTouchEnd,
      progressClick,
      progressBar,
      progress,
      progressWidth
    }
  }
})
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $text;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $text;
        border-radius: 50%;
        background: $text;
      }
    }
  }
}
</style>

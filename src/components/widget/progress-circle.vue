<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const dashArray = ref(Math.PI * 100)
    const dashOffset = computed(() => {
      return 1 - props.percent * dashArray.value
    })
    return {
      dashArray,
      dashOffset
    }
  }
})
</script>
<style lang="scss" scoped>
.progress-circle {
  position: relative;
  display: flex;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: $primary;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $gary;
    }
  }
}
</style>

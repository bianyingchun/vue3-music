<template>
  <div
    :class="['switch', value ? 'on' : 'off']"
    @click="$emit('update:value', !value)"
  >
    <span class="switch-btn"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    value: Boolean
  }
})
</script>

<style lang="scss" scoped>
.switch {
  width: 36px;
  height: 14px;
  border-radius: 14px;
  background-color: $gary;
  display: inline-block;
  position: relative;
  .switch-btn {
    position: absolute;
    width: 20px;
    height: 20px;
    top: -3px;
    border-radius: 10px;
    background: #525050;
    transition: all 0.4s ease-in-out;
  }
  &.on {
    .switch-btn {
      right: -3px;
    }
  }
  &.off {
    .switch-btn {
      left: -3px;
    }
  }
}
</style>

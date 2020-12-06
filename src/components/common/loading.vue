<template>
  <div class="loading-box">
    <span class="icon-loading"></span>
    <div class="text">loading</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss" scoped>
.loading-box {
  display: flex;
  justify-content: center;
  padding: $padding 0;
  .text {
    margin-left: $gap;
  }
}
</style>

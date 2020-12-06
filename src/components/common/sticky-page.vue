<template>
  <div class="page">
    <header>
      <div class="title-bar">
        <span class="iconfont icon-back" @click="$router.back()"></span>
        <span class="title">
          {{ title || '' }}
        </span>
        <div class="toolbar">
          <slot name="tools"></slot>
        </div>
      </div>
      <div class="navbar"><slot name="navbar"></slot></div>
    </header>
    <main>
      <slot name="default"></slot>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: String,
    shortcut: String,
    bgPic: String
  }
})
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $module-bg;
  header {
  }
  main {
    flex: 1;
    overflow-y: auto;
  }
}
</style>

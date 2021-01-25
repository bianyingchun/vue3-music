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
    title: String
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
    .title-bar {
      padding: 0 $padding-lg;
      display: flex;
      align-items: center;
      font-size: $font-size-lg;
      .icon-back {
        margin-right: $gap-lg;
        font-size: $font-size-lx;
      }
      .title {
        font-weight: 500;
        flex: 1;
        @include text-overflow;
      }
      .tools {
        .iconfont {
          margin-left: $gap-lg;
        }
      }
    }
  }
  main {
    flex: 1;
    overflow-y: auto;
  }
}
</style>

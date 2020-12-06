<template>
  <div id="root" :class="theme">
    <keep-alive :max="10">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
    <player />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, watch } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from './typing'
import Player from '@/components/achive/player.vue'

export default defineComponent({
  components: {
    Player
  },
  setup() {
    const store = useStore<GlobalState>()
    // 检测登录状态
    store.dispatch('auth/checkLogin')
    // 注入toast 插件
    const theme = computed(() => store.state.config.theme)
    provide('theme', theme)
    watch(
      theme,
      name => {
        document.body.className = name
      },
      { immediate: true }
    )
    return {
      theme
    }
  }
})
</script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: $font-size;
}

#root {
  min-height: 100vh;
  background: $body-bg;
  color: $text;
}
</style>

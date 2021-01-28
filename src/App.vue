<template>
  <div
    id="root"
    :class="[theme, { 'player-visible': playerVisible }]"
    v-if="isRouterAlive"
  >
    <keep-alive :max="10">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
    <player />
    <login-box />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from './types'
import Player from '@/components/achive/player.vue'
import LoginBox from '@/components/achive/login.vue'
export default defineComponent({
  components: {
    Player,
    LoginBox
  },
  setup() {
    const store = useStore<GlobalState>()
    const theme = computed(() => store.state.system.theme.current)
    const playerVisible = computed(
      () => !!store.getters['player/currentSong'].id
    )
    provide('theme', theme)
    // 检测登录状态
    store.dispatch('auth/checkLogin')
    const isRouterAlive = ref(true)
    function reload() {
      isRouterAlive.value = false
      nextTick(() => (isRouterAlive.value = true))
    }
    provide('reload', reload)
    watch(
      theme,
      name => {
        document.body.className = name
      },
      {
        immediate: true
      }
    )
    return {
      playerVisible,
      isRouterAlive
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
  background: $body-bg;
  color: $text;
  height: 100vh;
  background-color: $body-bg;
  color: $text;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  &.player-visible {
    padding-bottom: $player-height;
    .page-container {
      bottom: $player-height;
    }
  }
  .page-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
}
</style>

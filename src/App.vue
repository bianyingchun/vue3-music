<template>
  <div
    id="root"
    :class="[theme, { 'player-visible': playerVisible }]"
    v-if="isRouterAlive"
  >
    <!-- <keep-alive>
      <router-view></router-view>
    </keep-alive> -->
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
    <player />
    <login-box />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, watch, ref, nextTick } from 'vue'
import Player from '@/components/achive/player.vue'
import LoginBox from '@/components/achive/login.vue'
import useSystemStore from '@/store/system'
import useAuthStore from '@/store/auth'
import usePlayerStore from '@/store/player'
import { useRoute } from 'vue-router'
export default defineComponent({
  components: {
    Player,
    LoginBox
  },
  setup() {
    const systemStore = useSystemStore()
    const playerStore = usePlayerStore()
    const authStore = useAuthStore()
    const theme = computed(() => systemStore.theme.current)
    const playerVisible = computed(() => !!playerStore.currentSong?.id)
    provide('theme', theme)
    // 检测登录状态
    authStore.checkLogin()
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
    const route = useRoute()
    watch(
      () => route.fullPath,
      (value, oldValue) => {
        console.log(value, oldValue)
      }
    )
    return {
      playerVisible,
      isRouterAlive,
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

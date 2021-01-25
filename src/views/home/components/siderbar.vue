<template>
  <div class="siderbar-container">
    <span class="siderbar-toggle-btn" @click="visisble = true">
      <i class="iconfont icon-menu"></i>
    </span>
    <div :class="['siderbar', { show: visisble }]">
      <div class="mask" @click="visisble = false"></div>
      <div class="siderbar-content">
        <div class="siderbar-header">
          <account-box />
        </div>
        <div class="module-container">
          <div class="tool-item" @click="toggleTheme()">
            <span class="iconfont icon-night"></span>
            <span class="title">夜间模式</span>
            <switch-box :value="theme === 'dark'" />
          </div>
        </div>

        <div class="module-container" v-if="logined">
          <button
            class="tool-item logout"
            @click="logout"
            :disabled="isLogouting"
          >
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject } from 'vue'
import { useStore } from 'vuex'
import { GlobalState, Theme } from '@/types'
import { SET_SYSYTEM_THEME } from '@/store/action-types'
import AccountBox from '@/components/achive/account-box.vue'
import SwitchBox from '@/components/widget/switch.vue'
import { popup } from '@/plugin/popup'
export default defineComponent({
  components: {
    AccountBox,
    SwitchBox
  },
  setup() {
    const reload = inject('reload') as () => void
    const store = useStore<GlobalState>()
    const theme = computed(() => store.state.system.theme.current)
    function toggleTheme() {
      store.commit(
        'system/' + SET_SYSYTEM_THEME,
        theme.value === Theme.dark ? Theme.light : Theme.dark
      )
    }
    const logined = computed(() => store.state.auth.logined)
    const isLogouting = computed(() => store.state.auth.isLogouting)
    const logout = async () => {
      try {
        await popup('确认退出登录？')
        const res = await store.dispatch('auth/logout')
        console.log(res)
        if (res) {
          reload()
        }
      } catch (err) {
        console.log(err)
      }
    }
    const visisble = ref(false)

    return {
      theme,
      toggleTheme,
      visisble,
      logined,
      isLogouting,
      logout
    }
  }
})
</script>

<style lang="scss" scoped>
.siderbar-toggle-btn {
  .icon-menu {
    font-size: $font-size-lx;
  }
}
.siderbar {
  .mask {
    background: $modal-bg;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: $player-index + 1;
    opacity: 0;
    display: none;
    transition: all 0.4s linear;
  }
  .siderbar-content {
    position: fixed;
    left: 0;
    right: 60px;
    top: 0;
    bottom: 0;
    overflow: hidden;
    z-index: $player-index + 2;
    background: $body-bg;
    transform: translate3d(-100%, 0, 0);
    transition: transform 0.4s ease-in-out;
    color: $text;
    .module-container {
      .tool-item {
        padding: $padding;
        display: flex;
        align-items: center;
        .title {
          flex: 1;
          margin-right: $gap;
        }
        &.logout {
          color: $primary;
          justify-content: center;
          width: 100%;
        }
      }
    }
  }
  &.show {
    .mask {
      opacity: 1;
      display: block;
    }
    .siderbar-content {
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>

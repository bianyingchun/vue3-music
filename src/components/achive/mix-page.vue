<template>
  <div class="mix-container">
    <div class="title-bar">
      <div class="bg" :style="{ opacity: titleOpacity }">
        <div class="cover" :style="{ backgroundImage: `url(${bgPic})` }"></div>
      </div>
      <span class="iconfont icon-back" @click="$router.back()"></span>
      <span class="title">
        {{ slogan }}
      </span>
    </div>
    <div class="mix-info">
      <div class="bg">
        <div class="cover" :style="{ backgroundImage: `url(${bgPic})` }"></div>
      </div>
      <slot name="header"></slot>
      <div class="navbar" ref="navBarElm" :class="{ fixed: fixed }">
        <div class="navbar-content">
          <i class="iconfont icon-play"></i>
          <span>播放全部</span>
        </div>
      </div>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onUnmounted,
  nextTick,
  onMounted,
  computed
} from 'vue'

export default defineComponent({
  props: {
    title: String,
    bgPic: String
  },
  setup(props) {
    const navBarElm = ref<HTMLElement | null>(null)
    let offsetTop = 0
    const fixed = ref(false)
    const titleOpacity = ref(0)
    const slogan = computed(() => {
      return titleOpacity.value > 0.3 ? props.title : ''
    })
    function onScroll() {
      const top = document.documentElement.scrollTop || document.body.scrollTop
      fixed.value = top + 60 >= offsetTop
      titleOpacity.value = Math.min(1, top / offsetTop)
    }
    onMounted(async () => {
      nextTick(() => {
        if (navBarElm.value) {
          offsetTop = navBarElm.value.offsetTop
          window.addEventListener('scroll', onScroll)
        }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })
    return {
      navBarElm,
      fixed,
      titleOpacity,
      slogan
    }
  }
})
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: $module-bg;
  z-index: -1;
  overflow: hidden;
  .cover {
    filter: blur(70px);
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    left: 0;
    top: 0;
  }
}
.mix-container {
  .title-bar {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: $title-bar-index;
    overflow: hidden;
  }
}
$navbarHeight: 40px;
.mix-info {
  z-index: 1;
  overflow: hidden;
  padding: calc(#{$padding-lg} + 60px) $padding-lg $navbarHeight;
  background: $module-bg;
  min-height: 132px;
  position: relative;
  .navbar {
    height: $navbarHeight;
    line-height: $navbarHeight;
    position: absolute;
    left: 0;
    bottom: 0;
    background: $module-bg;
    right: 0;
    .navbar-content {
      background: $body-bg;
      padding: 0 $padding-lg;
      .iconfont {
        width: 25px;
        display: inline-block;
        text-align: center;
        margin-right: $gap;
      }
    }
    &.fixed {
      position: fixed;
      top: 60px;
    }
  }
}
</style>

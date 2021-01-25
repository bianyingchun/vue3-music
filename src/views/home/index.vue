<template>
  <div class="page-container home">
    <div class="home-navbar">
      <siderbar />
      <div class="nav-container">
        <div class="nav-list">
          <div
            class="nav-item"
            v-for="(item, index) in navList"
            :key="index"
            :class="{ active: index === navIndex }"
            @click="onToggleTab(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <router-link to="/search">
        <span className="iconfont icon-search"></span>
      </router-link>
    </div>
    <div class="home-content">
      <swiper
        @slideChange="onSlideChange"
        class="content"
        @swiper="setControlledSwiper"
      >
        <swiper-slide key="discovery" class="home-slide">
          <discovery />
        </swiper-slide>
        <swiper-slide key="mine" class="home-slide">
          <mine />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import Siderbar from './components/siderbar.vue'
import { useNavSwiper } from '@/hooks/useNavSwiper'
import Mine from '../mine/index.vue'
import Discovery from '../discovery/index.vue'
export default defineComponent({
  components: {
    Siderbar,
    Mine,
    Discovery,
    Swiper,
    SwiperSlide
  },
  setup() {
    const {
      navList,
      onSlideChange,
      onToggleTab,
      setControlledSwiper,
      navIndex
    } = useNavSwiper([{ name: '发现' }, { name: '我的' }])
    return {
      navIndex,
      navList,
      onSlideChange,
      onToggleTab,
      setControlledSwiper
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  .home-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $padding-lg;
    color: #fff;
    background: $header-bg;
    .iconfont {
      color: #fff;
    }
    .nav-list {
      display: flex;
      justify-content: center;
      align-items: center;
      .nav-item {
        font-size: $font-size-mx;
        color: rgba(255, 255, 255, 0.5);
        &.active {
          color: #fff;
          font-size: $font-size-lg;
          &::after {
            display: none;
          }
        }
      }
    }
  }
  .home-content {
    flex: 1;
    overflow: hidden;
    > .swiper-container {
      height: 100%;
    }
    .home-slide {
      overflow-y: auto;
    }
  }
}
</style>

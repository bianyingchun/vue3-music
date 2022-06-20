<template>
  <div
    class="discovery"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    ref="container"
  >
    <div class="banner">
      <swiper :autoplay="true" :loop="true" :pagination="{ el: '.swiper-pagination' }">
        <swiper-slide :key="index" v-for="(item, index) in banners">
          <div class="banner-item">
            <img :src="item.pic" alt="" />
          </div>
        </swiper-slide>
        <div class="swiper-pagination"></div>
      </swiper>
    </div>
    <div class="block ball-list">
      <router-link
        class="ball-item"
        v-for="(item, index) in ballList"
        :key="index"
        :to="item.url"
      >
        <div class="icon"><i class="iconfont" :class="item.icon"></i></div>
        <span class="text">{{ item.text }}</span>
      </router-link>
    </div>
    <div class="block" v-if="homeData.rcmdPlaylist">
      <div class="block-header">
        <h3>{{ homeData.rcmdPlaylist.title }}</h3>
        <router-link to="/playlist/square" class="block-btn"
          >更多 <i class="iconfont icon-right"></i
        ></router-link>
      </div>
      <rcmd-playlists :list="homeData.rcmdPlaylist.data"></rcmd-playlists>
    </div>
    <div class="block" v-if="homeData.customSonglist">
      <div class="block-header">
        <h3>{{ homeData.customSonglist.title }}</h3>
        <span class="block-btn">
          播放
          <i class="iconfont icon-play"></i>
        </span>
      </div>
      <custom-song
        :creatives="homeData.customSonglist.data"
        v-if="homeData.customSonglist"
      >
      </custom-song>
    </div>
    <div class="block" v-if="homeData.officalPlaylist">
      <div class="block-header">
        <h3>{{ homeData.officalPlaylist.title }}</h3>
        <router-link to="/playlist/square" class="block-btn"
          >更多 <i class="iconfont icon-right"></i
        ></router-link>
      </div>
      <rcmd-playlists :list="homeData.officalPlaylist.data"></rcmd-playlists>
    </div>
  </div>

  <span
    :class="['refresh-btn', { on: isRefreshing, off: !translateY }]"
    :style="{ transform: `translateY(${translateY}px) rotate(${rotate}deg)` }"
  >
    <i class="iconfont icon-loop"></i>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SwiperCore, { Scrollbar, Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { getHomePage, getHomeBallList, getBannerList } from "@/common/api/discovery";
import { HomePageData, Ball, Banner } from "@/types";
import CustomSong from "./components/custom-songs.vue";
import RcmdPlaylists from "./components/rcmd-playlists.vue";
SwiperCore.use([Scrollbar, Autoplay, Pagination]);
const refreshGap = 60;
const maxTranslateY = 120;
const perYDeg = 6;
export default defineComponent({
  components: {
    CustomSong,
    RcmdPlaylists,
    Swiper,
    SwiperSlide,
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup() {
    const homeData = ref<HomePageData>({});
    const ballList = ref<Ball[]>([]);
    const banners = ref<Banner[]>([]);
    async function getDiscoveryData() {
      const res = await Promise.all([getHomePage(), getHomeBallList()]);
      homeData.value = res[0];
      ballList.value = res[1];
    }
    async function getBanners() {
      const res = await getBannerList();
      if (res.data.code === 200) {
        banners.value = res.data.banners;
      }
    }

    const touch = {
      initialed: false,
      startY: 0,
      startX: 0,
      diffY: 0,
    };
    const isRefreshing = ref(false);
    const container = ref<null | HTMLDivElement>(null);
    const translateY = ref(0);
    const rotate = ref(0);

    async function refresh() {
      isRefreshing.value = true;
      await Promise.all([getDiscoveryData(), getBanners()]);
      isRefreshing.value = false;
      translateY.value = 0;
      rotate.value = 0;
    }

    const onTouchStart = (e: TouchEvent) => {
      const el = container.value;
      if (!el || el.scrollTop || isRefreshing.value) return;
      touch.initialed = true;
      touch.startY = e.touches[0].pageY;
      touch.startX = e.touches[0].pageX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touch.initialed || isRefreshing.value) return;
      const el = container.value?.parentElement;
      if (!el || el?.scrollTop) return;
      const { pageY } = e.touches[0];
      // const diffX = pageX - touch.startX
      const diffY = pageY - touch.startY;
      if (diffY > 0) {
        touch.diffY = diffY;
        translateY.value = Math.min(diffY, maxTranslateY);
        rotate.value = parseInt((perYDeg * translateY.value).toFixed(2));
      } else {
        touch.diffY = 0;
      }
    };
    const onTouchEnd = () => {
      const el = container.value?.parentElement;
      if (!el || isRefreshing.value) return;
      if (touch.diffY >= refreshGap) {
        refresh();
      } else {
        translateY.value = 0;
        rotate.value = 0;
      }
      touch.initialed = false;
    };
    refresh();
    return {
      ballList,
      homeData,
      banners,
      onTouchMove,
      onTouchStart,
      onTouchEnd,
      isRefreshing,
      container,
      translateY,
      rotate,
    };
  },
});
</script>

<style lang="scss" scoped>
.discovery {
  background: $module-bg;
  overflow: hidden;
  .banner {
    .banner-item {
      width: 100%;
      img {
        width: 100%;
        min-height: 136px;
        height: auto;
      }
    }
  }
  .ball-list {
    padding: $padding;
    display: flex;
    .ball-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: $gap;
      .icon {
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        display: inline-block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: $link-bg;
        margin-bottom: $gap-sm;
        .iconfont {
          font-size: $font-size-lg;
          color: #fff;
        }
      }
    }
  }
  .block {
    padding: $padding-lg;
    border-radius: $border-radius-lg;
    margin: $gap 0;
    background: $body-bg;
    .block-header {
      margin-bottom: $gap;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .block-btn {
        border-radius: 11px;
        line-height: 20px;
        border: 1px solid $gary;
        font-size: $font-size-sm;
        padding: 0 $padding-sm;
        .iconfont {
          font-size: $font-size-sm;
        }
      }
    }
  }
}
.swiper-pagination ::v-deep .swiper-pagination-bullet-active {
  background: #fff;
}
.refresh-btn {
  background: $module-bg;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  position: absolute;
  top: -50px;
  left: calc(50% - 20px);
  color: $text;
  z-index: $refresh-btn-index;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  &.off {
    transition: 0.3s linear all;
  }
  &.on {
    animation: rotate 1s linear infinite;
  }
}

@keyframes rotate {
  0% {
    transform: translateY(60px) rotate(0);
  }

  100% {
    transform: translateY(60px) rotate(360deg);
  }
}
</style>

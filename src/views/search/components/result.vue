<template>
  <div class="nav-swiper">
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
    <swiper
      @slideChange="onSlideChange"
      class="nav-content"
      @swiper="setControlledSwiper"
    >
      <swiper-slide v-for="(item, index) in navList" :key="item.type">
        <component
          :is="item.type + '-list'"
          :active="index === navIndex"
          :query="query"
        ></component>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'
import { useNavSwiper } from '@/hooks/useNavSwiper'
import { SearchTypeVal } from '@/types'
import TrackList from './track-list.vue'
import PlaylistList from './playlist-list.vue'
import UserList from './user-list.vue'
import ArtistList from './artist-list.vue'

import { SEARCH_TYPES } from '@/common/js/config'
export default defineComponent({
  props: {
    type: Number as PropType<SearchTypeVal>,
    query: String
  },
  components: {
    TrackList,
    PlaylistList,
    UserList,
    ArtistList,
    Swiper,
    SwiperSlide
  },
  setup() {
    const {
      navList,
      navIndex,
      setControlledSwiper,
      onSlideChange,
      onToggleTab
    } = useNavSwiper(SEARCH_TYPES)
    console.log(navList.value)
    return {
      navList,
      navIndex,
      setControlledSwiper,
      onSlideChange,
      onToggleTab
    }
  }
})
</script>

<style lang="scss" scoped>
.nav-swiper {
  height: 100%;
  .nav-list {
    height: 48px;
    flex: 1;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    .nav-item {
      padding: $padding $padding-lx;
      position: relative;
      &.active {
        color: $primary;
        font-weight: 600;
        &::after {
          display: block;
          content: '';
          height: 2px;
          background: $primary;
          position: absolute;
          width: 30px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
        }
      }
    }
  }
  .nav-content {
    height: calc(100% - 48px);
    .swiper-slide {
      overflow-y: auto;
      overflow-x: hidden;
      padding: $padding;
      box-sizing: border-box;
    }
  }
}
</style>

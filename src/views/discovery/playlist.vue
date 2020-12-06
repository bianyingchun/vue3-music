<template>
  <m-page title="歌单广场">
    <template #navbar>
      <div class="nav-container">
        <div class="nav-list">
          <div
            class="nav-item"
            v-for="(item, index) in navList"
            :key="index"
            :class="{ active: index === navIndex }"
            @click="toggleTab(index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="more-btn">more</div>
      </div>
    </template>
    <template #default>
      <swiper
        @slideChange="onSlideChange"
        class="content"
        @swiper="setControlledSwiper"
      >
        <swiper-slide v-for="item in navList" :key="item.name">
          <mix-list
            :name="item.name"
            @showhq="toggleShowHqFilter(true)"
            :tag="hqTag"
          ></mix-list>
        </swiper-slide>
      </swiper>
    </template>
  </m-page>
  <hqtag-filter
    v-model:show="showHqFilter"
    v-model:currentTag="hqTag"
  ></hqtag-filter>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import MixList from './components/list.vue'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
import HqtagFilter from './components/hqtag-filter.vue'
// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

export default defineComponent({
  components: {
    MixList,
    Swiper,
    SwiperSlide,
    HqtagFilter
  },
  setup() {
    const swiper = ref(null)
    const navIndex = ref(0)
    const navList = ref([
      { name: '推荐' },
      { name: '官方' },
      { name: '精品' },
      { name: '流行' },
      { name: '轻音乐' },
      { name: '电子' },
      { name: '韩语' }
    ])
    function onSlideChange(swiper: any) {
      navIndex.value = swiper.activeIndex
    }
    function toggleTab(index: number) {
      navIndex.value = index
      ;(swiper.value as any).slideTo(index, 0, false)
    }
    function setControlledSwiper(item: any) {
      swiper.value = item
    }
    const showHqFilter = ref(false)
    function toggleShowHqFilter(show: boolean) {
      console.log('show', show)
      showHqFilter.value = show
    }
    const hqTag = ref('全部')
    return {
      navList,
      navIndex,
      onSlideChange,
      toggleTab,
      setControlledSwiper,
      showHqFilter,
      hqTag,
      toggleShowHqFilter
    }
  }
})
</script>

<style lang="scss" scoped>
.nav-container {
  display: flex;
  align-items: center;
  .nav-list {
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
  .more-btn {
    padding: $padding;
  }
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>

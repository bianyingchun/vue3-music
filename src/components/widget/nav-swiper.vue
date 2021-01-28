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
    <!-- <swiper
      @slideChange="onSlideChange"
      class="nav-content"
      @swiper="setControlledSwiper"
    > -->
    <!-- <swiper-slide > -->
    <component
      v-bind:is="item.component"
      v-bind="item.data || {}"
      :active="index === navIndex"
      v-for="(item, index) in navList"
      :key="item.name"
    ></component>
    <!-- </swiper-slide> -->
    <!-- </swiper> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Component } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
export interface NavItem {
  name: string
  component: Component
  data?: any
  [prop: string]: any
}
export default defineComponent({
  props: {
    list: Array as PropType<NavItem[]>
  },
  components: {
    Swiper,
    SwiperSlide
  },
  setup(props) {
    const navIndex = ref(0)
    const navList = ref(props.list)
    const swiper = ref<any>(null)
    function onSlideChange(swiper: any) {
      navIndex.value = swiper.activeIndex
    }
    function onToggleTab(index: number) {
      navIndex.value = index
      ;(swiper.value as any).slideTo(index, 0, false)
    }
    function setControlledSwiper(item: any) {
      swiper.value = item
    }

    return {
      navList,
      navIndex,
      onSlideChange,
      onToggleTab,
      setControlledSwiper
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
  }
}
</style>

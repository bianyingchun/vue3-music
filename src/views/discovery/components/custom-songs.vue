<template>
  <div class="custom-songs">
    <swiper>
      <swiper-slide
        v-for="(creative, index) in creatives"
        :key="index"
        class="song-list"
      >
        <div
          class="song-item"
          v-for="item in creative.resources"
          :key="item.resourceId"
        >
          <img
            :src="item.resourceExtInfo.songData.album.picUrl"
            class="cover"
          />
          <div class="text">
            <div class="title">
              <span class="name">{{ item.resourceExtInfo.songData.name }}</span>
              <span class="artist">
                -{{
                  item.resourceExtInfo.songData.artists
                    .map(item => item.name)
                    .join('/')
                }}</span
              >
            </div>
            <div class="sub-title" v-if="item.uiElement.subTitle">
              {{ item.uiElement.subTitle.title }}
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Creative } from '@/typing/home'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])
export default defineComponent({
  props: {
    creatives: Array as PropType<Creative[]>
  },
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.custom-songs {
  .song-list {
    .song-item {
      padding: $padding-xs;
      display: flex;
      align-items: center;
      .cover {
        width: 50px;
        height: 50px;
        border-radius: $border-radius;
        margin-right: $gap;
        object-fit: cover;
      }
      .text {
        flex: 1;
        overflow: hidden;
        .title {
          @include text-overflow();
          display: flex;
          align-items: center;
          .artist {
            font-size: $font-size-xs;
            color: $gary;
            margin-left: $gap-xs;
          }
        }
        .sub-title {
          @include text-overflow();
          color: $text-secondary;
          font-size: $font-size-xs;
        }
      }
    }
  }
}
</style>

<template>
  <div class="custom-songs">
    <swiper>
      <swiper-slide v-for="(creative, index) in creatives" :key="index">
        <div class="song-list">
          <div
            class="song-item"
            v-for="item in creative.resources"
            :key="item.resourceId"
            @click="onSelect(item.resourceExtInfo.songData.index)"
          >
            <div class="cover">
              <img
                :src="item.resourceExtInfo.songData.album.picUrl"
                class="cover"
              />
              <i
                class="iconfont icon-pause"
                v-if="
                  item.resourceExtInfo.songData &&
                    currentSong &&
                    currentSong.id === item.resourceExtInfo.songData.id &&
                    playing
                "
              ></i>
              <i class="iconfont icon-play-fill" v-else></i>
            </div>
            <div class="text">
              <div class="title">
                <span class="name">{{
                  item.resourceExtInfo.songData.name
                }}</span>
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
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { useStore } from 'vuex'
import { Creative, Track, GlobalState } from '@/types'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'
import { usePlayMusic } from '@/hooks/usePlayer'
import { transformTrack } from '@/common/js/music'
export default defineComponent({
  props: {
    creatives: Array as PropType<Creative[]>
  },
  components: {
    Swiper,
    SwiperSlide
  },
  setup(props) {
    const store = useStore<GlobalState>()
    const { currentSong, selectPlay, playing } = usePlayMusic(store)
    const list = ref<Track[]>([])
    if (props.creatives) {
      props.creatives.forEach(item => {
        item.resources.forEach(item => {
          const song = item.resourceExtInfo.songData
          if (song) {
            const track = transformTrack(song)
            song.index = list.value.length
            list.value.push(track)
          }
        })
      })
    }
    function onSelect(index?: number) {
      if (index === void 0) return
      selectPlay(list.value, index)
    }
    return {
      onSelect,
      currentSong,
      playing
    }
  }
})
</script>

<style lang="scss" scoped>
.custom-songs {
  .swiper-container {
    overflow: visible;
  }
  .song-list {
    width: 100%;
    margin-right: -40px;
    .song-item {
      padding: $padding-xs;
      display: flex;
      align-items: center;
      .cover {
        width: 50px;
        height: 50px;
        border-radius: $border-radius;
        margin-right: $gap;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .iconfont {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: $font-size-lg;
          color: rgba($color: #fff, $alpha: 0.8);
        }
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

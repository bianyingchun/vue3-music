<template>
  <router-link :to="'/playlist/' + mix.id" class="mix-item">
    <div class="cover">
      <img :src="mix.coverImgUrl" />
      <span class="play-count" v-if="!isToplist">
        <i class="iconfont icon-play"></i>
        {{ formatNumber(mix.playCount) }}
      </span>
      <span class="desc" v-if="isToplist">{{ mix.updateFrequency }}</span>
    </div>
    <div class="text">{{ mix.name }}</div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Playlist } from '@/typing'
import { formatNumber } from '@/common/js/util'
export default defineComponent({
  props: {
    mix: {
      type: Object as PropType<Playlist>
    },
    isToplist: Boolean
  },
  setup() {
    return {
      formatNumber
    }
  }
})
</script>

<style lang="scss" scoped>
.mix-item {
  display: inline-block;
  .cover {
    position: relative;
    padding-top: 100%;
    margin-bottom: $gap-sm;
    img {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
      border-radius: $border-radius;
    }
    .play-count,
    .desc {
      font-size: $font-size-sm;
      position: absolute;
    }
    .play-count {
      top: $gap-sm;
      right: $gap-sm;
      display: flex;
      align-items: center;
      font-size: $font-size-sm;
      .iconfont {
        font-size: $font-size-sm;
        margin-right: $gap-xs;
      }
    }
    .desc {
      left: $gap-sm;
      bottom: $gap-sm;
    }
  }
  .text {
    @include mutil-text-overflow(2, 100%);
  }
}
</style>

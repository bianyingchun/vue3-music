<template>
  <div class="artist-item" @click="$router.push(`/artist/${artist.id}`)">
    <img class="avatar" :src="artist.picUrl" />
    <div class="name">{{ artist.name }}</div>
    <span class="follow-status unfollowed" v-if="!artist.followed">
      <i class="iconfont icon-add"></i>关注
    </span>
    <span class="follow-status" v-else>
      <i class="iconfont icon-selected"></i>
      已关注</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Artist } from '@/types'
export default defineComponent({
  props: {
    artist: Object as PropType<Artist>
  }
})
</script>

<style lang="scss" scoped>
.artist-item {
  display: flex;
  align-items: center;
  padding: $padding;
  .avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
  }
  .name {
    flex: 1;
    margin: 0 $gap;
  }
  .follow-status {
    width: 60px;
    text-align: center;
    line-height: 24px;
    height: 24px;
    border-radius: 24px;
    border: 1px solid $gary;
    font-size: $font-size-sm;
    .iconfont {
      font-size: $font-size-sm;
    }
    &.unfollowed {
      border-color: $primary;
      color: $primary;
    }
  }
}
</style>

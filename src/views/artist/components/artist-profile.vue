<template>
  <div class="scroller-container artist-profile" v-if="artist">
    <div class="module-container base-info" v-if="userDetail">
      <div class="module-header">
        <h3 class="title">基本信息</h3>
      </div>
      <div class="content">
        <div>昵称：{{ userDetail.profile.nickname }}</div>
        <div>性别：{{ userDetail.profile.gender ? '男' : '女' }}</div>
        <div>简介：{{ artist.briefDesc }}</div>
      </div>
    </div>
    <div class="module-container artist-desc" v-else>
      <div class="module-header">
        <h3 class="title">歌手简介</h3>
      </div>
      <div class="content">{{ artist.briefDesc }}</div>
    </div>
    <user-music :playlist="playlist" v-if="playlist"></user-music>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserDetail, Artist } from '@/typing'
import UserMusic from '@/components/achive/user-music.vue'
export default defineComponent({
  props: {
    userDetail: Object as PropType<UserDetail>,
    artist: Object as PropType<Artist>,
    playlist: Object
  },
  components: {
    UserMusic
  }
})
</script>

<style lang="scss" scoped>
.base-info,
.artist-desc {
  .content {
    padding: 0 $padding-lg $padding;
    > div {
      margin-bottom: $gap;
    }
  }
}
</style>

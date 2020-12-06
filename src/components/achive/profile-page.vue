<template>
  <div
    class="profile-page scroller-container"
    v-if="artist || (userDetail && userDetail.profile)"
  >
    <div class="title-bar">
      <div class="title-bg" :style="{ opacity: titleOpacity }"></div>
      <span class="iconfont icon-back" @click="$router.back()"></span>
      <span class="title">
        {{ artist ? artist.name : userDetail.profile.nickname }}
      </span>
    </div>
    <div class="profile-bg">
      <img :src="artist ? artist.picUrl : userDetail.profile.backgroundUrl" />
      <div class="mask"></div>
    </div>
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-header-bg"></div>
        <img
          :src="userDetail.profile.avatarUrl"
          class="avatar"
          v-if="userDetail"
        />
        <div class="profile-header-content">
          <h2 class="nickname">
            {{ artist ? artist.name : userDetail.profile.nickname }}
          </h2>
          <div class="stat-list" v-if="userDetail">
            <span class="stat-item">
              {{ userDetail.profile.followeds }}
              <span class="stat-text">关注</span>
            </span>
            <div class="divide"></div>
            <span class="stat-item"
              >{{ userDetail.profile.follows }}
              <span class="stat-text">关注</span>
            </span>
            <div class="divide"></div>
            <span class="stat-item"> Lv.{{ userDetail.level }}</span>
          </div>
          <div class="stat-list" v-else></div>
          <div class="action-box">
            <button
              type="button"
              class="follow-status"
              v-if="artist ? artist.followed : userDetail.profile.followed"
            >
              已关注
            </button>
            <button type="button" class="follow-status unfollowed" v-else>
              <i class="iconfont icon-add"></i>关注
            </button>
          </div>
        </div>
      </div>
      <div class="profile-main">
        <div class="profile-navbar">
          <slot name="navbar"></slot>
        </div>
        <div class="profile-swiper">
          <slot name="default"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { UserDetail, Artist } from '@/typing'
export default defineComponent({
  props: {
    bgPic: String,
    artist: Object as PropType<Artist | null>,
    userDetail: Object as PropType<UserDetail | null>
  },
  setup() {
    const titleOpacity = ref(0)
    return {
      titleOpacity
    }
  }
})
</script>
<style lang="scss" scoped>
.profile-page {
  .title-bar {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: $title-bar-index;
    .title-bg {
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      background: $module-bg;
      z-index: -1;
    }
  }
  .profile-bg {
    width: 100%;
    padding-top: 70%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .profile-container {
    .profile-header {
      position: relative;
      padding: 30px 0;
      margin: 0 $gap-lg;
      z-index: 1;
      .profile-header-bg {
        background: #{$module-bg};
        opacity: 0.85;
        position: absolute;
        top: -20px;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: $border-radius-mx;
        z-index: -1;
      }
      .avatar {
        position: absolute;
        height: 80px;
        width: 80px;
        border-radius: 50%;
        border: 2px solid $text;
        left: 50%;
        top: -70px;
        transform: translateX(-50%);
      }
      .profile-header-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;

        .stat-list {
          display: flex;
          align-items: center;
          font-size: $font-size-sm;
          margin: $gap 0;
          .stat-text {
            color: $text-secondary;
            margin-left: $gap-xs;
          }
          .divide {
            height: 10px;
            width: 1px;
            margin: 0 $gap-lg;
            background: $gary;
          }
        }
        .action-box {
          .follow-status {
            width: 80px;
            text-align: center;
            line-height: 30px;
            height: 30px;
            border-radius: 30px;
            border: 0.5px solid $gary;
            .iconfont {
              font-size: $font-size-sm;
            }
            &.unfollowed {
              background: $primary;
              border-color: $primary;
            }
          }
        }
      }
    }
    .profile-main {
      height: calc(100vh - 60px);
      display: flex;
      flex-direction: column;
      .profile-swiper {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>

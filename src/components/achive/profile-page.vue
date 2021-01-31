<template>
  <div
    class="page-container profile-page"
    ref="container"
    @scroll.stop="onScroll"
  >
    <div class="title-bar">
      <div class="title-bg" :style="{ opacity: titleOpacity }"></div>
      <span class="iconfont icon-back" @click="$router.back()"></span>
      <span class="title">
        {{
          (userDetail ? userDetail.profile.nickname : '') ||
            (artist ? artist.name : '')
        }}
      </span>
    </div>
    <div class="profile-bg" ref="header">
      <img
        :src="artist ? artist.picUrl : userDetail.profile.backgroundUrl"
        v-if="userDetail || artist"
      />
      <div class="mask"></div>
    </div>
    <div class="profile-container" v-if="userDetail || artist">
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
            <router-link
              class="stat-item"
              :to="`/user/${userDetail.profile.userId}/follows`"
            >
              {{ userDetail.profile.follows }}
              <span class="stat-text">关注</span>
            </router-link>
            <div class="divide"></div>
            <router-link
              class="stat-item"
              :to="`/user/${userDetail.profile.userId}/followeds`"
              >{{ userDetail.profile.followeds }}
              <span class="stat-text">粉丝</span>
            </router-link>
            <div class="divide"></div>
            <span class="stat-item"> Lv.{{ userDetail.level }}</span>
          </div>
          <div class="stat-list" v-else></div>
          <div
            class="action-box"
            v-if="
              !(
                userDetail &&
                account &&
                account.id === userDetail.profile.userId
              )
            "
          >
            <button
              type="button"
              class="follow-status"
              v-if="artist ? artist.followed : userDetail.profile.followed"
              @click="onToggleFollow(false)"
            >
              已关注
            </button>
            <button
              type="button"
              class="follow-status unfollowed"
              @click="onToggleFollow(true)"
              v-else
            >
              <i class="iconfont icon-add"></i>关注
            </button>
          </div>
        </div>
      </div>
      <div class="profile-main" :class="{ unscrollable: !scrollable }">
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
import { defineComponent, PropType, ref, onMounted, computed } from 'vue'
import { UserDetail, Artist } from '@/types'
import { popup } from '@/plugin/popup'
import { useStore } from 'vuex'
import { GlobalState } from '@/types'
import { useAuth } from '@/hooks/useAuth'
export default defineComponent({
  emits: ['toggle-follow'],
  props: {
    bgPic: String,
    artist: Object as PropType<Artist | null>,
    userDetail: Object as PropType<UserDetail | null>
  },
  setup(props, { emit }) {
    const store = useStore<GlobalState>()
    const { account } = useAuth(store)
    const titleOpacity = ref(0)
    const scrollable = ref(false)
    const container = ref<HTMLDivElement | null>(null)
    const header = ref<HTMLDivElement | null>(null)
    let headerHeight = 0
    onMounted(() => {
      const node = header.value
      if (node) {
        headerHeight = node.clientHeight
        const el = node.parentNode?.querySelector('.profile-header')
        if (el) headerHeight += el.clientHeight
      }
    })
    function onScroll() {
      const node = container.value
      if (node) {
        const top = node.scrollTop
        const ratio = parseFloat(
          Math.min(1, top / (headerHeight - 60)).toFixed(2)
        )
        titleOpacity.value = ratio
        scrollable.value = ratio >= 0.99
      }
    }
    const followed = computed(
      () =>
        (props.userDetail && props.userDetail.profile.followed) ||
        (props.artist && props.artist.followed)
    )
    function onToggleFollow(value: boolean) {
      if (value) {
        emit('toggle-follow', value)
      } else {
        popup('确定取消关注？')
          .then(() => {
            emit('toggle-follow', false)
          })
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .catch(() => {})
      }
    }

    return {
      titleOpacity,
      container,
      header,
      onScroll,
      scrollable,
      followed,
      onToggleFollow,
      account
    }
  }
})
</script>
<style lang="scss" scoped>
.profile-page {
  overflow-y: auto;
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
        border: 2px solid #fff;
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
              color: #fff;
            }
          }
        }
      }
    }
    .profile-main {
      height: calc(100vh - 60px);
      display: flex;
      flex-direction: column;
      &.unscrollable ::v-deep .scroller-container {
        overflow: hidden;
      }
      .profile-swiper {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>

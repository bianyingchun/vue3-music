<template>
  <div className="account-box" @click="onClick">
    <img
      :src="profile ? profile.avatarUrl : defaultAvatar"
      className="avatar"
    />
    <div className="text">
      <h3 className="nickname">
        {{ profile ? profile.nickname : '立即登录' }}
      </h3>
      <span className="iconfont icon-right"></span>
    </div>
  </div>
</template>

<script lang="ts" scoped>
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export default defineComponent({
  setup() {
    const router = useRouter()
    const store = useStore<GlobalState>()
    const { profile, toggleLoginBox } = useAuth(store)
    function onClick() {
      if (profile.value) {
        router.push('/user/' + profile.value.userId)
      } else {
        toggleLoginBox(true)
      }
    }
    return {
      profile,
      onClick,
      defaultAvatar: require('@/assets/pics/avatar.png')
    }
  }
})
</script>

<style lang="scss" scoped>
.account-box {
  display: flex;
  align-items: center;
  margin: $padding-lg;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .text {
    flex: 1;
    display: flex;
    margin: 0 $gap;
    overflow: hidden;
    .nickname {
      white-space: nowrap;
      -ms-text-overflow: ellipsis;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
    }
    .icon-right {
      margin-left: $gap-sm;
      color: $text;
    }
  }
}
</style>

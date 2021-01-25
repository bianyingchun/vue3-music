<template>
  <profile-page :userDetail="userDetail" @toggle-follow="onToggleFollow">
    <template #default>
      <div class="scroller-container">
        <div className="module-container base-info">
          <div className="module-header">
            <h3 className="title">基本信息</h3>
          </div>
          <div className="user-info" v-if="userDetail">
            <div>昵称：{{ userDetail.profile.nickname }}</div>
            <div>性别：{{ userDetail.profile.gender ? '男' : '女' }}</div>
            <div>简介：{{ userDetail.profile.signature || '暂无介绍' }}</div>
          </div>
        </div>
        <user-music :playlist="playlist"></user-music>
      </div>
    </template>
  </profile-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import UserMusic from '@/components/achive/user-music.vue'
import { useRoute } from 'vue-router'
import { getUserDetail, getUserPlaylist, followUser } from '@/common/api/user'
import ProfilePage from '@/components/achive/profile-page.vue'
import { UserDetail } from '@/types'
import { showToast } from '@/plugin/toast'
export default defineComponent({
  components: {
    UserMusic,
    ProfilePage
  },
  setup() {
    const route = useRoute()
    const uid = Number(route.params.id)
    const userDetail = ref<UserDetail | null>(null)
    const playlist = ref({})
    onMounted(async () => {
      const res = await getUserDetail(uid)
      userDetail.value = res.data
      playlist.value = await getUserPlaylist(uid)
    })
    async function onToggleFollow(followed: boolean) {
      try {
        const res = await followUser(uid, followed)
        if (res.data.code === 200) {
          if (userDetail.value) userDetail.value.profile.followed = followed
        } else {
          showToast('操作失败')
        }
      } catch (err) {
        showToast('操作失败')
      }
    }
    return {
      userDetail,
      playlist,
      onToggleFollow
    }
  }
})
</script>

<style lang="scss" scoped>
.user-info {
  padding: $padding $padding-lg;
}
</style>

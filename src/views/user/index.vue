<template>
  <profile-page :userDetail="userDetail">
    <template #default>
      <div class="scroller-container">
        <user-music :playlist="playlist"></user-music>
      </div>
    </template>
  </profile-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import UserMusic from '@/components/achive/user-music.vue'
import { useRoute } from 'vue-router'
import { getUserDetail, getUserPlaylist } from '@/common/api/user'
import ProfilePage from '@/components/achive/profile-page.vue'
export default defineComponent({
  components: {
    UserMusic,
    ProfilePage
  },
  setup() {
    const route = useRoute()
    const userDetail = ref({})
    const playlist = ref({})
    onMounted(async () => {
      const uid = Number(route.params.id)
      const res = await getUserDetail(uid)
      userDetail.value = res.data
      playlist.value = await getUserPlaylist(uid)
    })
    return {
      userDetail,
      playlist
    }
  }
  // <div class="profile">
  //     <div class="userInfo">
  //       <img :src="profile.avatarUrl" class="avatar" />
  //       <div class="stat-list">
  //         <span class="stat-item">关注 {{ profile.followeds }}</span>
  //         <span class="stat-item">粉丝 {{ profile.follows }}</span>
  //       </div>
  //     </div>
  //     <div class="action-box">
  //       <div class="follow-time">{{ profile.followTime }}</div>
  //     </div>
  //   </div>
})
</script>

<style lang="scss" scoped>
.profile {
  .userInfo {
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
</style>

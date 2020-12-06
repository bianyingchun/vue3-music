<template>
  <profile-page
    class="artist-profile"
    :userDetail="userDetail"
    :artist="artist"
  >
    <template #navbar>
      <div class="nav-container">
        <div class="nav-list">
          <div
            class="nav-item"
            v-for="(item, index) in navList"
            :key="index"
            :class="{ active: index === navIndex }"
            @click="toggleTab(index)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <swiper
        @slideChange="onSlideChange"
        class="content"
        @swiper="setControlledSwiper"
      >
        <swiper-slide key="detail">
          <artist-profile
            :userDetail="userDetail"
            :artist="artist"
            :playlist="playlist"
          ></artist-profile>
        </swiper-slide>
        <swiper-slide :key="music">
          <top-music :list="hotSongs" :more="more"></top-music>
        </swiper-slide>
      </swiper>
    </template>
  </profile-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { getArtistProfile } from '@/common/api/artist'
import { getUserDetail, getUserPlaylist } from '@/common/api/user'
import ArtistProfile from './components/artist-profile.vue'
import TopMusic from './components/top-music.vue'
import ProfilePage from '@/components/achive/profile-page.vue'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])
export default defineComponent({
  components: {
    TopMusic,
    ArtistProfile,
    ProfilePage,
    Swiper,
    SwiperSlide
  },
  setup() {
    const route = useRoute()
    const id = Number(route.params.id)
    const state = reactive<any>({
      more: false,
      hotSongs: [],
      artist: null,
      userDetail: null,
      playlist: null
    })
    onMounted(async () => {
      const res = await getArtistProfile(id)
      const { more, hotSongs, artist } = res.data
      state.more = more
      state.hotSongs = hotSongs
      state.artist = artist
      const aid = res.data.artist.accountId
      if (aid) {
        const resArr = await Promise.all([
          getUserDetail(aid),
          getUserPlaylist(aid)
        ])
        state.userDetail = resArr[0].data
        state.playlist = resArr[1]
      }
    })

    // swiper
    const navIndex = ref(0)
    const navList = ref([{ name: '主页' }, { name: '热门歌曲' }])
    const swiper = ref(null)
    function onSlideChange(swiper: any) {
      navIndex.value = swiper.activeIndex
    }
    function toggleTab(index: number) {
      navIndex.value = index
      ;(swiper.value as any).slideTo(index, 0, false)
    }
    function setControlledSwiper(item: any) {
      swiper.value = item
    }
    return {
      ...toRefs(state),
      navList,
      navIndex,
      onSlideChange,
      toggleTab,
      setControlledSwiper
    }
  }
})
</script>
<style lang="scss" scoped>
.nav-container {
  display: flex;
  align-items: center;
  .nav-list {
    flex: 1;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    .nav-item {
      padding: $padding $padding-lx;
      position: relative;
      &.active {
        color: $primary;
        font-weight: 600;
        &::after {
          display: block;
          content: '';
          height: 2px;
          background: $primary;
          position: absolute;
          width: 30px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
        }
      }
    }
  }
  .more-btn {
    padding: $padding;
  }
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>

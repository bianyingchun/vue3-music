<template>
  <div class="discovery">
    <div class="block ball-list">
      <router-link
        class="ball-item"
        v-for="(item, index) in ballList"
        :key="index"
        :to="item.url"
      >
        <div class="icon">
          <img :src="item.icon" alt="" />
        </div>
        <div class="text">{{ item.text }}</div>
      </router-link>
    </div>
    <div class="block" v-if="homeData.rcmdPlaylist">
      <div class="block-header">
        <h3>{{ homeData.rcmdPlaylist.title }}</h3>
        <router-link to="/discovery/playlist" class="block-btn"
          >更多 <i class="iconfont icon-right"></i
        ></router-link>
      </div>
      <rcmd-playlists :list="homeData.rcmdPlaylist.data"></rcmd-playlists>
    </div>
    <div class="block" v-if="homeData.customSonglist">
      <div class="block-header">
        <h3>{{ homeData.customSonglist.title }}</h3>
        <span class="block-btn">
          播放
          <i class="iconfont icon-play"></i>
        </span>
      </div>
      <custom-song
        :creatives="homeData.customSonglist.data"
        v-if="homeData.customSonglist"
      >
      </custom-song>
    </div>
    <div class="block" v-if="homeData.officalPlaylist">
      <div class="block-header">
        <h3>{{ homeData.officalPlaylist.title }}</h3>
        <router-link to="/discovery/playlist" class="block-btn"
          >更多 <i class="iconfont icon-right"></i
        ></router-link>
      </div>
      <rcmd-playlists :list="homeData.officalPlaylist.data"></rcmd-playlists>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getHomePage, getHomeBallList } from '@/common/api/discovery'
import { HomePageData, Ball } from '@/typing/home'
import CustomSong from './components/custom-songs.vue'
import RcmdPlaylists from './components/rcmd-playlists.vue'

export default defineComponent({
  components: {
    CustomSong,
    RcmdPlaylists
  },
  setup() {
    const homeData = ref<HomePageData>({})
    const ballList = ref<Ball[]>([])
    async function getData() {
      const res = await Promise.all([getHomePage(), getHomeBallList()])
      homeData.value = res[0]
      ballList.value = res[1]
    }
    getData()
    return {
      ballList,
      homeData
    }
  }
})
</script>

<style lang="scss" scoped>
.discovery {
  background: $module-bg;
  overflow: hidden;
  .ball-list {
    padding: $padding;
    display: flex;
    .ball-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: $gap;
      .icon {
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        display: inline-block;
        width: 50px;
        height: 50px;
        background: $link-bg;
        margin-bottom: $gap-sm;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  .block {
    padding: $padding-lg;
    border-radius: $border-radius-lg;
    margin: $gap 0;
    background: $body-bg;
    .block-header {
      margin-bottom: $gap;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .block-btn {
        border-radius: 11px;
        line-height: 20px;
        border: 1px solid $gary;
        font-size: $font-size-sm;
        padding: 0 $padding-sm;
        .iconfont {
          font-size: $font-size-sm;
        }
      }
    }
  }
}
</style>

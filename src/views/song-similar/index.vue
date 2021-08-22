<template>
  <m-page title="相似推荐" class="song-similar-page">
    <div class="block">
      <div class="title">包含这首歌的歌单</div>
      <div class="content playlist-list">
        <router-link
          class="mix-item"
          v-for="item in playlistList"
          :key="item.id"
          :to="'/playlist/' + item.id"
        >
          <div class="cover">
            <img :src="item.coverImgUrl" alt="" />
          </div>
          <div class="text">{{ item.name }}</div>
        </router-link>
      </div>
    </div>
    <div class="block">
      <div class="title">喜欢这首歌的人也听</div>
      <div class="content">
        <song-list :list="songList" :rank="false"></song-list>
      </div>
    </div>
  </m-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getSimilarSongs, getSimilarPlaylists } from '@/common/api/song'
import { useRoute } from 'vue-router'
import { Playlist, Track } from '@/types'
import SongList from '@/components/achive/song-list.vue'
import { transformTrack } from '@/common/js/music'
export default defineComponent({
  setup() {
    const route = useRoute()
    const sid = Number(route.params.id)
    const songList = ref<Track[]>([])
    const playlistList = ref<Playlist[]>([])
    async function getPlaylistList() {
      const res = await getSimilarPlaylists(sid)
      playlistList.value = res.data.playlists
    }
    async function getSongList() {
      const res = await getSimilarSongs(sid)
      songList.value = res.data.songs.map(item => transformTrack(item))
    }
    getPlaylistList()
    getSongList()
    return {
      songList,
      playlistList
    }
  },
  components: {
    SongList
  }
})
</script>

<style lang="scss" scoped>
.song-similar-page {
  .block {
    .title {
      background-color: $module-bg;
      padding: $padding $padding-sm;
      color: $text-secondary;
      font-size: $font-size-sm;
    }
    .playlist-list {
      display: flex;
      .mix-item {
        flex: 1;
        padding: $padding-sm;
        overflow: hidden;
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
        }
      }
      .text {
        @include text-overflow();
      }
    }
  }
}
</style>

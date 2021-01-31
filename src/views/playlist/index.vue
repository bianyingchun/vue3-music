<template>
  <loading v-if="loading"></loading>
  <mix-page
    :title="playlist.name"
    :bgPic="playlist.coverImgUrl"
    v-if="playlist"
    @play-all="playAll"
  >
    <template #header>
      <div class="playlist-container">
        <div class="playlist-info">
          <div
            class="cover"
            :style="{ 'background-image': `url(${playlist.coverImgUrl})` }"
          ></div>
          <div class="content" v-if="playlist">
            <h3 class="title">{{ playlist.name }}</h3>
            <router-link
              class="creator"
              v-if="playlist.creator"
              :to="`/user/${playlist.creator.userId}`"
            >
              <img :src="playlist.creator.avatarUrl" alt="" class="avatar" />
              <span class="nickname">{{ playlist.creator.nickname }}</span>
              <span class="iconfont icon-right"></span>
            </router-link>
            <div class="desc">
              <div class="text">{{ playlist.description }}</div>
              <span class="iconfont icon-right"></span>
            </div>
          </div>
        </div>
        <div class="toolbar">
          <div
            class="tool-item"
            @click="toggleSubscribe(playlist)"
            v-if="!isSelf"
          >
            <i
              :class="[
                'iconfont',
                playlist.subscribed ? 'icon-fav-fill' : 'icon-fav'
              ]"
            ></i>
            {{ playlist.subscribedCount }}
          </div>
          <div class="tool-item disabled" v-else>
            <i class="iconfont icon-fav"></i>
            收藏
          </div>
          <div
            class="tool-item"
            @click="$router.push(`/comment/playlist/${playlist.id}`)"
          >
            <i class="iconfont icon-comment"></i
            >{{ playlist.commentCount ? playlist.commentCount : '评论' }}
          </div>
          <div class="tool-item">
            <i class="iconfont icon-share"></i
            >{{ playlist.shareCount ? playlist.shareCount : '分享' }}
          </div>
        </div>
      </div>
    </template>
    <template #main>
      <song-list
        :list="playlist.tracks"
        :currentItem="currentSong"
        :rank="true"
        :canDelete="isSelf"
        :trackIds="playlist.trackIds"
        :inToplist="playlist.specialType === 10"
        @select="selectPlay"
        @delete="unFavTrackToMix"
      >
      </song-list>
    </template>
  </mix-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import SongList from '@/components/achive/song-list.vue'
import { usePlayMusic } from '@/hooks/usePlayer'
import MixPage from '@/components/achive/mix-page.vue'
import { usePlaylist, useMylist } from '@/hooks/usePlaylist'
import Loading from '@/components/common/loading.vue'
import { Track, GlobalState } from '@/types'
export default defineComponent({
  setup() {
    const loading = ref<boolean>(true)
    const route = useRoute()
    const id = Number(route.params.id)
    const store = useStore<GlobalState>()
    const { selectPlay, currentSong } = usePlayMusic(store)
    const {
      playlist,
      toggleSubscribe,
      getPlaylistDetail,
      checkIsSelf
    } = usePlaylist(store)
    const { deleteTrack } = useMylist(store)
    async function getDetail() {
      loading.value = true
      await getPlaylistDetail(id)
      loading.value = false
    }
    const isSelf = computed(() => {
      return playlist.value ? checkIsSelf(playlist.value) : false
    })
    async function unFavTrackToMix(track: Track) {
      if (!isSelf.value) return
      await deleteTrack(id, track)
    }
    function playAll() {
      selectPlay(playlist.value?.tracks || [], 0)
    }
    getDetail()
    return {
      playAll,
      playlist,
      loading,
      selectPlay,
      currentSong,
      toggleSubscribe,
      isSelf,
      unFavTrackToMix
    }
  },
  components: {
    MixPage,
    SongList,
    Loading
  }
})
</script>

<style lang="scss" scoped>
.playlist-info {
  display: flex;
  .cover {
    position: relative;
    margin-right: $gap-lg;
    background-color: $module-bg;
    width: 132px;
    height: 132px;
    border-radius: $border-radius;
    background-size: cover;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .title,
    .desc > .text {
      @include mutil-text-overflow(2, 100%);
    }
    .creator {
      display: flex;
      align-items: center;
      margin-top: $gap-sm;
      color: rgba(255, 255, 255, 0.7);
      .avatar {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        margin-right: $gap;
      }
      .nickname {
        margin-right: $gap-sm;
      }
    }
    .desc {
      margin-top: auto;
      display: flex;
      height: 36px;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: $font-size-sm;
      .text {
        flex: 1;
        margin-right: $gap-xs;
      }
    }
  }
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  .tool-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $padding $padding-lg;
    font-size: $font-size-sm;
    &.disabled {
      color: $gary;
    }
  }
}
</style>

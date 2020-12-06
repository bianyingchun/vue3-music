<template>
  <div class="mine-page-container">
    <router-link
      :to="`/user/${userInfo.userId}`"
      class="account"
      v-if="userInfo"
    >
      <img :src="userInfo.avatarUrl" class="avatar" />
      <div class="text">
        <h3 class="title">{{ userInfo.nickname }}</h3>
      </div>
      <span class="iconfont icon-arrow-right">></span>
    </router-link>

    <mix-item
      :mix="playlist.likelist"
      class="module-container likelist"
      v-if="playlist.likelist"
    ></mix-item>

    <div class="module-container mix-list-container">
      <div class="mix-list-header">
        <span class="title">创建歌单 ({{ playlist.created.length }}个)</span>
        <div class="tools">
          <add-mix></add-mix>
        </div>
      </div>
      <div class="mix-list">
        <mix-item v-for="item in playlist.created" :key="item.id" :mix="item">
          <tool-panel
            :title="`歌单:${item.name}`"
            :list="getTools(item)"
          ></tool-panel>
        </mix-item>
      </div>
    </div>
    <div class="module-container mix-list-container">
      <div class="mix-list-header">
        <span class="title">收藏歌单 ({{ playlist.faved.length }})</span>
        <div class="tools"></div>
      </div>
      <div class="mix-list">
        <mix-item v-for="item in playlist.faved" :key="item.id" :mix="item">
          <tool-panel
            :title="`歌单:${item.name}`"
            :list="getTools(item)"
          ></tool-panel>
        </mix-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/typing'
import MixItem from '@/components/achive/tiny-mix-item.vue'
import ToolPanel from '@/components/achive/tool-panel.vue'
import AddMix from '@/components/achive/create-playlist.vue'
import { Playlist } from '@/typing/playlist'
import { usePlaylist, useMylist } from '@/hooks/usePlaylist'
export default defineComponent({
  components: {
    MixItem,
    ToolPanel,
    AddMix
  },
  setup() {
    const store = useStore<GlobalState>()
    const userInfo = computed(() => store.state.auth.profile)
    const playlist = computed(() => store.state.playlists.mine)
    const { checkIsSelf, toggleSubscribe } = usePlaylist(store)
    const { deletePlaylist } = useMylist(store)
    function getTools(playlist: Playlist) {
      const isSelf = checkIsSelf(playlist)
      const list = []
      if (isSelf) {
        list.push({
          icon: 'icon-edit',
          text: '编辑歌单',
          action() {
            console.log('edit', playlist)
          }
        })
      }
      list.push({
        icon: 'icon-delete',
        text: '删除',
        action() {
          if (isSelf) {
            deletePlaylist(playlist.id)
          } else {
            toggleSubscribe(playlist)
          }
        }
      })
      return list
    }
    return {
      userInfo,
      playlist,
      getTools
    }
  }
})
</script>

<style lang="scss" scoped>
.module-container {
  margin: $gap-lg 0;
}
.mine-page-container {
  .account {
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
    }
  }
  .likelist {
    padding: $padding-lg;
  }
  .mix-list-container {
    .mix-list-header {
      padding: $padding-lg;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: $font-size-sm;
        color: $gary;
      }
    }
    .mix-list {
      padding-bottom: $gap;
    }
  }
}
</style>

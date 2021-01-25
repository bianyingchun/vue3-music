<template>
  <div class="mine-page-container">
    <account-box />
    <mix-item
      :mix="likelist"
      class="module-container likelist"
      v-if="likelist"
    ></mix-item>

    <div class="module-container mix-list-container">
      <div class="mix-list-header">
        <span class="title">创建歌单 ({{ createdList.length }}个)</span>
        <div class="tools">
          <add-mix></add-mix>
        </div>
      </div>
      <div class="mix-list">
        <mix-item v-for="item in createdList" :key="item.id" :mix="item">
          <tool-panel
            :title="`歌单:${item.name}`"
            :list="getTools(item)"
          ></tool-panel>
        </mix-item>
      </div>
    </div>
    <div class="module-container mix-list-container">
      <div class="mix-list-header">
        <span class="title">收藏歌单 ({{ favedList.length }})</span>
        <div class="tools"></div>
      </div>
      <div class="mix-list">
        <mix-item v-for="item in favedList" :key="item.id" :mix="item">
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
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import MixItem from '@/components/achive/tiny-mix-item.vue'
import ToolPanel from '@/components/achive/tool-panel.vue'
import AddMix from '@/components/achive/create-playlist.vue'
import AccountBox from '@/components/achive/account-box.vue'
import { Playlist, GlobalState } from '@/types'
import { usePlaylist, useMylist } from '@/hooks/usePlaylist'

export default defineComponent({
  components: {
    MixItem,
    ToolPanel,
    AddMix,
    AccountBox
  },
  setup() {
    const store = useStore<GlobalState>()
    const { checkIsSelf, toggleSubscribe } = usePlaylist(store)
    const { deletePlaylist, createdList, likelist, favedList } = useMylist(
      store
    )
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
      createdList,
      likelist,
      favedList,
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

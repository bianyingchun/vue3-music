<template>
  <span class="create-playlist-trigger">
    <i class="iconfont icon-add" @click="toggle(true)"></i>
  </span>
  <bottom-panel :show="visible" @hide="toggle(false)">
    <div class="create-playlist-container">
      <div class="btns">
        <button type="button">取消</button>
        <button
          type="button"
          @click="submit"
          :disabled="!playlist.name || playlist.name.length > 40"
        >
          完成
        </button>
      </div>
      <h3 class="title">新建歌单</h3>
      <input
        type="text"
        placeholder="请输入新歌单标题"
        maxlength="40"
        v-model.trim="playlist.name"
        class="input-box"
      />
      <div class="toggle-privacy">
        <div class="checkbox-view">
          <span class="state">
            <i class="iconfont icon-selected" v-if="playlist.privacy"></i>
          </span>
          <span class="text">设置为隐私歌单</span>
        </div>
        <input type="checkbox" v-model="playlist.privacy" name="privacy" />
      </div>
    </div>
  </bottom-panel>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BottomPanel from '../widget/bottom-panel.vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/typing'
export default defineComponent({
  components: {
    BottomPanel
  },
  setup() {
    const visible = ref(false)
    function toggle(value: boolean) {
      visible.value = value
    }
    const playlist = ref({
      name: '',
      privacy: false
    })

    const store = useStore<GlobalState>()
    async function submit() {
      visible.value = false
      await store.dispatch('playlists/addPlaylist', playlist.value)
    }
    return {
      visible,
      toggle,
      playlist,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
.create-playlist-trigger .iconfont {
  color: $gary;
}
.create-playlist-container {
  padding: $padding-lg;
  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $gap-lg;
    button {
      font-size: $font-size-mx;
    }
  }
  .input-box {
    padding: $padding-sm;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.2);
    margin: $gap-lg 0;
  }
  .toggle-privacy {
    position: relative;
    input[type='checkbox'] {
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border-radius: $border-radius-sm;
    }
    .checkbox-view {
      display: flex;
      align-items: center;
      .state {
        border-radius: $border-radius-sm;
        border: $gary solid 1px;
        margin-right: $gap;
        width: 14px;
        height: 14px;
        display: inline-flex;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        .iconfont {
          font-size: $font-size;
          color: $primary;
        }
      }
      .text {
        color: $text-secondary;
      }
    }
  }
}
</style>

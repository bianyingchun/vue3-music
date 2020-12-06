<template>
  <span class="playlist-trigger">
    <i class="iconfont icon-play-list" @click.stop="toggle()"></i>
  </span>
  <bottom-panel :show="show" @hide="hide()">
    <div class="current-playlist">
      <header>
        <div class="title">
          当前播放<span class="count">({{ sequenceList.length }})</span>
        </div>
        <div class="tools">
          <div class="play-mode">
            <span :class="['iconfont', mode.icon]" @click="changeMode"></span
            >{{ mode.text }}
          </div>
          <div class="fav-btn">
            <span class="iconfont icon-add-box"></span>收藏全部
          </div>
          <div class="clear-btn">
            <span class="iconfont icon-delete"></span>
          </div>
        </div>
      </header>
      <main>
        <div class="song-list">
          <div
            class="song-item"
            v-for="(song, index) in sequenceList"
            :key="index"
            :class="{ active: currentSong.id === song.id }"
          >
            <div class="content" @click.stop="setCurrentSong(song)">
              <span class="name">{{ song.name }}</span>
              <span class="desc">
                - {{ song.ar.map(item => item.name).join('/') }}</span
              >
            </div>
            <div class="play-flag">播放来源</div>
            <div class="tools">
              <span
                class="iconfont icon-close"
                @click.stop="deleteSong(song)"
              ></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </bottom-panel>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BottomPanel from '../widget/bottom-panel.vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/typing'
import { usePlayMusic } from '@/hooks/usePlayer'
import { Track } from '@/typing/playlist'
import * as Types from '@/store/action-types'
export default defineComponent({
  components: {
    BottomPanel
  },

  setup() {
    const show = ref(false)
    function toggle() {
      show.value = !show.value
    }
    function hide() {
      show.value = false
    }
    const store = useStore<GlobalState>()
    const {
      setCurrentSong,
      currentSong,
      sequenceList,
      mode,
      changeMode
    } = usePlayMusic(store)
    function deleteSong(song: Track) {
      store.dispatch('player/deleteSong', song)
    }
    function clearPlayList() {
      store.commit('player/' + Types.SET_PLAYLIST, [])
    }
    return {
      show,
      toggle,
      hide,
      sequenceList,
      setCurrentSong,
      currentSong,
      mode,
      changeMode,
      deleteSong,
      clearPlayList
    }
  }
})
</script>

<style lang="scss" scoped>
.icon-play-list {
  font-size: 24px;
}

.current-playlist {
  position: fixed;
  left: $gap;
  right: $gap;
  bottom: 0;
  height: 400px;
  background: $module-bg;
  border-radius: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  .iconfont {
    color: $text-secondary;
  }
  header {
    padding: $padding;
    .title {
      font-size: $font-size-mx;
      font-weight: bold;
      line-height: 1.8;
      .count {
        color: $text-secondary;
        margin-left: $gap-sm;
      }
    }
    .tools {
      display: flex;
      align-items: center;
      .play-mode {
        flex: 1;
        .iconfont {
          margin-right: $gap-sm;
        }
      }
      .fav-btn {
        margin-right: $gap;
        .iconfont {
          margin-right: $gap-sm;
        }
      }
      .clear-btn {
        margin-left: $gap;
      }
    }
  }
  main {
    flex: 1;
    overflow-y: auto;
    .song-item {
      display: flex;
      padding: $padding;
      justify-content: space-between;
      .content {
        @include text-overflow(60%);
        .desc {
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }
      .play-flag {
        display: none;
      }
      &.active {
        .content {
          color: $primary;
          .desc {
            color: $primary;
          }
        }
        .play-flag {
          display: inline-block;
          font-size: $font-size-sm;
          border: 1px solid $gary;
          border-radius: 13px;
          height: 24px;
          line-height: 24px;
          padding: 0 $padding;
        }
      }
    }
  }
}
</style>

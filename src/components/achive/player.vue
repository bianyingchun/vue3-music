<template>
  <div class="player-container">
    <div class="player" v-if="playList.length" @click="$router.push('/song')">
      <div class="icon"><img :src="currentSong.al.picUrl" /></div>
      <div class="text">
        <div class="name">{{ currentSong.name }}</div>
        <div class="lyric">{{ currentLyric }}</div>
      </div>
      <div class="control" :class="{ playing: playing }">
        <progress-circle
          :percent="percent"
          :radius="36"
          @click.stop="togglePlay"
        >
          <span class="iconfont icon-pause icon-mini" v-if="playing"></span>
          <span class="iconfont icon-play icon-mini" v-else></span>
        </progress-circle>
      </div>
      <div class="control">
        <play-list></play-list>
      </div>
    </div>
    <audio
      ref="audio"
      @error="onError"
      @timeupdate="onUpdateTime"
      @ended="onEnd"
      @play="onPlay()"
      @pause="onPause()"
    ></audio>
  </div>
</template>

<script lang="ts">
import { GlobalState } from '@/typing'
import { defineComponent, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import ProgressCircle from '@/components/widget/progress-circle.vue'
import { usePlayer } from '@/hooks/usePlayer'
import PlayList from './current-playlist.vue'
export default defineComponent({
  components: {
    ProgressCircle,
    PlayList
  },
  setup() {
    const store = useStore<GlobalState>()
    const {
      currentSong,
      playList,
      playing,
      togglePlay,
      percent,
      onUpdateTime,
      audio,
      onEnd,
      onPause,
      onPlay,
      playSong,
      currentLyric
    } = usePlayer(store)
    watch(
      () => currentSong.value,
      song => {
        if (song && song.id) {
          // store.dispatch('player/fetchLyric', song.id)
          nextTick(() => {
            playSong(song)
          })
        }
      },
      {
        immediate: true
      }
    )
    function onError() {
      console.log('error')
    }

    return {
      currentSong,
      playList,
      playing,
      togglePlay,
      onError,
      onPlay,
      onEnd,
      onPause,
      onUpdateTime,
      audio,
      percent,
      currentLyric
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 60px;
  right: 0;
  z-index: $player-index;
  background: $module-bg;
  display: flex;
  align-items: center;

  .icon {
    width: 40px;
    height: 40px;
    padding: 0 $padding 0 $padding-lg;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .text {
    flex: 1;
    overflow: hidden;

    .name {
      margin-bottom: $gap-sm;
      @include text-overflow();
    }

    .lyric {
      color: $text-secondary;
      font-size: $font-size-xs;
      @include text-overflow();
    }
  }

  .control {
    padding: 0 $padding;
    .iconfont {
      font-size: 32px;
    }
    .icon-mini {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 16px;
      transform: translate(-50%, -50%);
      &.icon-pause {
        color: $primary;
      }
    }
    &.playing {
      ::v-deep .progress-bar {
        stroke: $gary;
      }
    }
  }
}
</style>

<template>
  <div class="player-container" v-if="currentSong.id">
    <div class="player" v-if="playList.length" @click="toggleFullScreen(true)">
      <div class="icon">
        <img :src="currentSong.al.picUrl" />
      </div>
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
      <div class="control" @click.stop="showPlayList = true">
        <span className="iconfont icon-play-list"></span>
      </div>
    </div>
    <div class="full-player" v-show="fullScreen">
      <div
        class="bg"
        :style="{ backgroundImage: `url(${currentSong.al.picUrl})` }"
      ></div>
      <div class="content">
        <header>
          <span
            class="iconfont icon-back"
            @click="toggleFullScreen(false)"
          ></span>
          <div class="title">
            <div class="name">{{ currentSong.name }}</div>
            <div class="singer" @click="showSongAr(currentSong)">
              {{ singerName + ' >' }}
            </div>
          </div>
          <span className="iconfont icon-share"></span>
        </header>
        <main @click="toggleShowLyric">
          <div
            class="disc-wraper"
            :style="{ visibility: showLyric ? 'hidden' : 'visible' }"
          >
            <div class="m-song-disc" :class="{ playing: playing }">
              <img class="image" :src="currentSong.al.picUrl" />
            </div>
            <div class="player-toolbar" @click.stop>
              <div class="tool-item" v-if="isliked" @click="toggleLike(false)">
                <span class="iconfont icon-fav-fill"></span>
              </div>
              <div class="tool-item" v-else @click="toggleLike(true)">
                <span class="iconfont icon-fav"></span>
              </div>
              <div
                class="tool-item"
                @click="$router.push(`/comment/music/${currentSong.id}`)"
              >
                <span class="iconfont icon-comment"></span>
              </div>
              <div class="tool-item" @click="favTrackToMix(currentSong)">
                <span class="iconfont icon-add-box"></span>
              </div>
            </div>
          </div>
          <div
            class="lyric-wraper"
            :style="{ visibility: showLyric ? 'visible' : 'hidden' }"
          >
            <div class="lyric-list" v-if="lyric.data.lrc" id="lyric-list">
              <div
                v-for="(item, index) in lyric.data.lrc"
                :key="index"
                @dblclick="setPlayTime(item.time)"
                :class="[
                  'lyric-item',
                  { active: lyric.currentIndex === index }
                ]"
              >
                {{ item.value }}
              </div>
            </div>
            <div class="no-lyric" v-if="lyric.data.nolyric">纯音乐请欣赏</div>
          </div>
        </main>
        <footer>
          <div class="progress-wrapper">
            <span class="time time-l">{{ timeParser(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent="percent"
                :cachePercent="cachePercent"
                @change="onPercentChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ timeParser(currentSong.dt) }}</span>
          </div>
          <div class="operators">
            <span :class="['iconfont', mode.icon]" @click="changeMode"></span>
            <span class="iconfont icon-play-prev" @click="prev"></span>
            <div class="play-btn" @click="togglePlay">
              <span class="iconfont icon-pause" v-if="playing"></span>
              <span class="iconfont icon-play-fill" v-else></span>
            </div>
            <span class="iconfont icon-play-next" @click="next"></span>
            <span
              className="iconfont icon-play-list"
              @click="showPlayList = true"
            ></span>
          </div>
        </footer>
      </div>
    </div>
    <audio
      ref="audio"
      @timeupdate="onUpdateTime()"
      @error="onError()"
      @ended="onEnd()"
      @play="onPlay()"
      @pause="onPause()"
    ></audio>
    <bottom-panel :show="showPlayList" @hide="showPlayList = false">
      <play-list
        :currentSong="currentSong"
        :sequenceList="sequenceList"
        :mode="mode"
        @clear="clearSong"
        @change-mode="changeMode"
        @change-song="setCurrentSong"
        @delete="deleteSong"
      ></play-list>
    </bottom-panel>
  </div>
</template>

<script lang="ts">
import { GlobalState } from '@/types'
import { defineComponent, watch, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import ProgressCircle from '@/components/widget/progress-circle.vue'
import { usePlayer } from '@/hooks/usePlayer'
import PlayList from './current-playlist.vue'
import ProgressBar from '@/components/widget/progress-bar.vue'
import BottomPanel from '@/components/widget/bottom-panel.vue'
import { timeParser } from '@/common/js/music'
import { favTrackToMix } from '@/hooks/useFavToMix'
import { showSongAr } from '@/hooks/useSongAr'
export default defineComponent({
  components: {
    ProgressCircle,
    PlayList,
    BottomPanel,
    ProgressBar
  },
  setup() {
    const showPlayList = ref(false)
    const store = useStore<GlobalState>()
    const {
      fullScreen,
      toggleFullScreen,
      currentSong,
      currentLyric,
      singerName,
      playList,
      playing,
      togglePlay,
      percent,
      cachePercent,
      currentTime,
      onUpdateTime,
      onPercentChange,
      audio,
      playSong,
      mode,
      changeMode,
      next,
      prev,
      onPause,
      onEnd,
      onPlay,
      onError,
      lyric,
      isliked,
      toggleLike,
      deleteSong,
      clearSong,
      setCurrentSong,
      sequenceList
    } = usePlayer(store)
    watch(
      () => currentSong.value,
      song => {
        if (song && song.id) {
          // store.dispatch('player/fetchLyric', song.id)
          nextTick(() => {
            playSong(song)
          })
        } else {
          showPlayList.value = false
        }
      },
      {
        immediate: true
      }
    )
    const showLyric = ref(false)
    function toggleShowLyric() {
      showLyric.value = !showLyric.value
    }

    let lyricHeightArr: number[] = []
    watch(
      () => lyric.value.data.lrc,
      () => {
        nextTick(() => {
          lyricHeightArr = []
          const ps = document.querySelectorAll('.lyric-item')
          let h = 0
          for (let i = 0; i < ps.length; i++) {
            lyricHeightArr.push(h)
            h += ps[i].clientHeight
          }
        })
      },
      {
        immediate: true
      }
    )
    watch(
      () => lyric.value.currentIndex,
      index => {
        const top = lyricHeightArr[index]
        const wraper = document.querySelector('.lyric-wraper')
        ;(wraper as HTMLElement).scrollTo({
          top,
          behavior: 'smooth'
        })
      }
    )
    const route = useRoute()
    watch(
      () => route.path,
      () => {
        if (fullScreen.value) {
          toggleFullScreen(false)
        }
      }
    )
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
      cachePercent,
      fullScreen,
      toggleFullScreen,
      showPlayList,
      deleteSong,
      clearSong,
      setCurrentSong,
      timeParser,
      lyric,
      showLyric,
      toggleShowLyric,
      currentLyric,
      singerName,
      currentTime,
      onPercentChange,
      isliked,
      toggleLike,
      mode,
      changeMode,
      next,
      prev,
      showSongAr,
      favTrackToMix,
      sequenceList
    }
  }
})
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  left: 0;
  bottom: 0;
  height: $player-height;
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
      font-size: 30px;
      color: $gary;
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
      .progress-bar {
        stroke: $gary;
      }
    }
  }
}

@media screen and (min-width: 414px) {
  .m-song-disc {
    width: 342px;
    height: 342px;
  }
}

@media screen and (min-width: 360px) {
  .m-song-disc {
    width: 296px;
    height: 296px;
  }
}

.full-player {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: $fullscreen-player-index;
  background: $body-bg;
  color: #fff;
  .iconfont {
    color: #fff;
  }
  .bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    background-size: cover;
    box-sizing: border-box;
    filter: blur(50px) brightness(0.6);
  }

  .content {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: $padding-lg;
    header {
      display: flex;
      align-items: center;
      .title {
        flex: 1;
        margin: 0 $padding;
        overflow: hidden;
        .name {
          @include text-overflow();
        }
        .singer {
          font-size: $font-size-sm;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }

  main {
    flex: 1;
    position: relative;
    .lyric-wraper {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      top: 0;
      text-align: center;
      overflow: auto;
      .lyric-list {
        transition: transform 0.3s ease-in-out;
        padding: 50% 0;
        .lyric-item {
          padding: $padding;
          color: $gary;
          &.active {
            color: #fff;
          }
        }
      }
      .no-lyric {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .disc-wraper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .m-song-disc {
        box-sizing: border-box;
        border: 5px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        overflow: hidden;
        img {
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
        animation-fill-mode: forwards;
        animation: rotate 20s linear infinite;
        animation-play-state: paused;
        &.playing {
          animation-play-state: running;
        }
      }
      .player-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        right: 30px;
        left: 30px;
        bottom: 0;
        .tool-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: $padding $padding-lg;
          .iconfont {
            font-size: 24px;
            &.icon-fav-fill {
              color: $primary;
            }
          }
        }
      }
    }
  }

  footer {
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      padding: $padding 0;

      .time {
        font-size: $font-size-xs;
        flex: 0 0 30px;
        line-height: 30px;
        width: 30px;

        &.time-r {
          color: $gary;
        }
      }

      .progress-bar-wrapper {
        flex: 1;
        margin: 0 $gap;
      }
    }

    .operators {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $padding $padding-lg;

      .iconfont {
        font-size: 24px;
      }

      .play-btn {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 2px solid #fff;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

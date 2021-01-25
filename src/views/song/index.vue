<template>
  <div class="player" v-show="playList.length">
    <div
      class="bg"
      :style="{ backgroundImage: `url(${currentSong.al.picUrl})` }"
    ></div>
    <div class="content">
      <header>
        <div class="back" @click="$router.back()">back</div>
        <div class="title">
          <div class="name">{{ currentSong.name }}</div>
          <div class="singer" @click="showSongAr(currentSong)">
            {{ singerName + ' >' }}
          </div>
        </div>
        <div class="tools">分享</div>
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
              :class="['lyric-item', { active: lyric.currentIndex === index }]"
            >
              {{ item.value }}
            </div>
          </div>
          <div class="no-lyric" v-if="lyric.data.nolyric">纯音乐请欣赏</div>
        </div>
      </main>
      <footer>
        <div class="progress-wrapper">
          <span class="time time-l">{{ format(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :percent="percent"
              @change="onPercentChange"
            ></progress-bar>
          </div>
          <span class="time time-r">{{ format(currentSong.dt) }}</span>
        </div>
        <div class="operators">
          <span :class="['iconfont', mode.icon]" @click="changeMode"></span>
          <span class="iconfont icon-play-prev" @click="prev"></span>
          <div class="play-btn" @click="togglePlay">
            <span class="iconfont icon-pause" v-if="playing"></span>
            <span class="iconfont icon-play-fill" v-else></span>
          </div>
          <span class="iconfont icon-play-next" @click="next"></span>
          <play-list></play-list>
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { GlobalState } from '@/types'
import { defineComponent, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import ProgressBar from '@/components/widget/progress-bar.vue'
import { usePlayer } from '@/hooks/usePlayer'
import { favTrackToMix } from '@/hooks/useFavToMix'
import { showSongAr } from '@/hooks/useSongAr'
import PlayList from '@/components/achive/current-playlist.vue'
export default defineComponent({
  components: {
    ProgressBar,
    PlayList
  },
  setup() {
    const store = useStore<GlobalState>()
    const {
      currentSong,
      currentTime,
      singerName,
      playList,
      playing,
      togglePlay,
      percent,
      onPercentChange,
      changeMode,
      next,
      prev,
      mode,
      lyric,
      isliked,
      toggleLike
    } = usePlayer(store)
    function format(t: number) {
      t = Math.floor(t / 1000)
      let m: string | number = Math.floor(t / 60)
      let s: string | number = t % 60
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    }
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
    const lyricTransY = ref(0)
    return {
      currentSong,
      playing,
      singerName,
      percent,
      onPercentChange,
      mode,
      changeMode,
      prev,
      next,
      togglePlay,
      playList,
      currentTime,
      format,
      showLyric,
      toggleShowLyric,
      lyric,
      lyricTransY,
      isliked,
      toggleLike,
      favTrackToMix,
      showSongAr
    }
  }
})
</script>

<style lang="scss" scoped>
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

.player {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  z-index: $fullscreen-player-index;
  background: $body-bg;
  .bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    background-size: cover;
    box-sizing: border-box;
    filter: blur(50px) brightness(0.8);
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
      padding: $padding;

      .title {
        flex: 1;
        margin: 0 $padding;

        .singer {
          font-size: $font-size-sm;
          color: $text-secondary;
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
        color: $text;
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
        border: 2px solid $text;
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

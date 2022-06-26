<template>
  <mix-page
    title="每日推荐"
    :bgPic="list.length ? list[0].al.picUrl : ''"
    @play-all="playAll"
  >
    <template #header>
      <div class="daily-recommend-info">
        <div class="time">
          <span class="date">{{ time.date }}</span>
          <span class="divide">/</span>
          <span class="month"> {{ time.month }}</span>
        </div>
        <div class="text">
          <h3 class="title">每日歌曲推荐</h3>
          <div class="desc">根据你的音乐口味生成，每日6点更新</div>
        </div>
      </div>
    </template>
    <template #main>
      <song-list
        :list="list"
        :currentItem="currentSong"
        :rank="false"
        @select="selectPlay"
      >
      </song-list>
    </template>
  </mix-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { getRecommendSongs } from '@/common/api/discovery'
import SongList from '@/components/achive/song-list.vue'
import MixPage from '@/components/achive/mix-page.vue'
import { Track } from '@/types'
import { usePlayMusic } from '@/hooks/usePlayer'
import { useAuth } from '@/hooks/useAuth'
export default defineComponent({
  setup() {
    const list = ref<Track[]>([])
    const loading = ref<boolean>(true)
    const { selectPlay, currentSong } = usePlayMusic()
    async function getData() {
      loading.value = true
      const res = await getRecommendSongs()
      list.value = res
      loading.value = false
    }
    const date = new Date()
    const time = {
      date: date.getDate(),
      month: date.getMonth() + 1
    }
    function playAll() {
      selectPlay(list.value || [], 0)
    }
    const { account, toggleLoginBox } = useAuth()
    if (!account.value) {
      toggleLoginBox(true)
    }
    watch(
      account,
      value => {
        if (value) {
          getData()
        } else {
          list.value = []
        }
      },
      { immediate: true }
    )
    return {
      playAll,
      list,
      loading,
      selectPlay,
      currentSong,
      time
    }
  },
  components: {
    SongList,
    MixPage
  }
})
</script>

<style lang="scss" scoped>
.daily-recommend-info {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  .time {
    display: flex;
    align-items: baseline;
    margin-right: $gap;
    font-size: $font-size-lg;
    .date {
      font-size: 36px;
    }
    .divide {
      margin: 0 $gap-xs;
    }
  }
  .text {
    flex: 1;
  }
}
</style>

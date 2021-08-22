<template>
  <div class="song-list">
    <div
      @click="selectItem(song, index)"
      class="song-item"
      v-for="(song, index) in list"
      :key="index"
      :class="{ active: currentItem && currentItem.id === song.id }"
    >
      <div class="rank" v-if="rank" :class="{ active: inToplist && index < 3 }">
        <div class="num">{{ index + 1 }}</div>
        <div class="update" v-if="inToplist">
          <span
            class="iconfont icon-new new"
            v-if="getUpdateRank(song, index).new"
            >new</span
          >
          <span v-else-if="getUpdateRank(song, index).up" class="up">
            <i class="iconfont icon-up">↑</i>
            {{ getUpdateRank(song, index).up }}
          </span>
          <span v-else-if="getUpdateRank(song, index).down" class="down">
            <i class="iconfont icon-down">↓</i>
            {{ getUpdateRank(song, index).down }}
          </span>
          <span v-else>
            <i> - </i>
            {{ getUpdateRank(song, index).down }}
          </span>
        </div>
      </div>
      <img
        :src="song.al.picUrl"
        class="pic"
        v-else-if="song.al && song.al.picUrl"
      />
      <div class="content">
        <div class="name">
          {{ song.name }}
          <span v-if="song.alia.length">({{ song.alia[0] }})</span>
        </div>
        <div class="desc">
          <span class="singer-album">{{
            getSingerName(song) + '-' + song.al.name
          }}</span>
        </div>
      </div>
      <div class="tools" @click.stop>
        <tool-panel :title="`歌曲: ${song.name}`" :list="getTools(song)">
        </tool-panel>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Track, TrackId } from '@/types'
import ToolPanel from '@/components/achive/tool-panel.vue'
import { favTrackToMix } from '@/hooks/useFavToMix'
import { useSongAr } from '@/hooks/useSongAr'

export default defineComponent({
  components: { ToolPanel },
  props: {
    list: {
      type: Array as PropType<Track[]>,
      default: []
    },
    trackIds: {
      type: Array as PropType<TrackId[]>,
      default: []
    },
    inToplist: Boolean,
    rank: Boolean,
    currentItem: {
      type: Object as PropType<Track>,
      default: {}
    },
    canDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'delete'],
  setup(props, { emit }) {
    const { getSingerName, showSongAr } = useSongAr()
    function selectItem(item: Track, index: number) {
      // if (props.currentItem.id === item.id) {
      //   router.push({
      //     path: '/song'
      //   })
      // } else {
      emit('select', props.list, index)
      // }
    }

    function getTools(song: Track) {
      const list = [
        {
          text: '收藏到歌单',
          icon: 'icon-add-box',
          action() {
            favTrackToMix(song)
          }
        },
        {
          icon: 'icon-singer',
          text: '歌手:' + getSingerName(song),
          action() {
            showSongAr(song)
          }
        },
        {
          icon: 'icon-album',
          text: '专辑:' + song.al.name,
          action() {
            console.log('to do go album page')
          }
        }
      ]
      if (props.canDelete) {
        list.push({
          icon: 'icon-delete',
          text: '删除',
          action() {
            emit('delete', song)
          }
        })
      }
      return list
    }
    function getUpdateRank(track: Track, index: number) {
      const info = {
        new: false,
        up: 0,
        down: 0
      }
      const lr = props.trackIds[index].lr
      if (lr === undefined) {
        info.new = true
      } else {
        const r = index - lr
        if (r > 0) {
          info.down = r
        } else {
          info.up = 0 - r
        }
      }
      return info
    }

    return {
      selectItem,
      getUpdateRank,
      ToolPanel,
      getSingerName,
      getTools
    }
  }
})
</script>

<style lang="scss" scoped>
.song-item {
  display: flex;
  padding: $padding $padding-lg;
  align-items: center;
  &.active {
    .rank {
      color: $primary;
    }
  }
  .rank {
    width: 30px;
    color: $text-secondary;
    margin-right: $gap;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.active {
      font-weight: bold;
      color: $primary;
    }
    .update {
      font-size: $font-size-xs;
      color: $gary;
      transform: scale(0.8, 0.8);
      .iconfont {
        font-size: $font-size-xs;
      }
      .new {
        color: #57d15d;
      }
      .up {
        color: #fb4911;
      }
      .down {
        color: #68c6fd;
      }
    }
  }
  .pic {
    border-radius: $border-radius;
    width: 40px;
    height: 40px;
    margin-right: $gap;
  }
  .content {
    flex: 1;
    overflow: hidden;
    .name {
      @include text-overflow();
      > span {
        color: $text-secondary;
      }
    }
    .desc {
      @include text-overflow();
      color: $text-secondary;
      font-size: $font-size-xs;
    }
  }
  .tools {
    padding: 0 $padding;
  }
}
</style>

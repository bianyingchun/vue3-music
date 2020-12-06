<template>
  <div class="user-music">
    <div class="module-container">
      <div class="module-header">
        <h3 class="title">音乐品味</h3>
      </div>
      <mix-item
        :mix="playlist.likelist"
        class="likelist"
        v-if="playlist.likelist"
      ></mix-item>
    </div>
    <div class="module-container mix-list-container">
      <div class="module-header" v-if="playlist.created">
        <h3 class="title">创建歌单</h3>
        <span class="sub-text"> ({{ playlist.created.length }}个)</span>
      </div>
      <div class="mix-list">
        <mix-item
          v-for="item in playlist.created"
          :key="item.id"
          :mix="item"
        ></mix-item>
      </div>
    </div>
    <div class="module-container mix-list-container" v-if="playlist.faved">
      <div class="module-header">
        <h3 class="title">收藏歌单</h3>
        <span class="sub-text">({{ playlist.faved.length }}个)</span>
      </div>
      <div class="mix-list">
        <mix-item
          v-for="item in playlist.faved"
          :key="item.id"
          :mix="item"
        ></mix-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MixItem from '@/components/achive/tiny-mix-item.vue'

export default defineComponent({
  props: {
    playlist: Object
  },
  components: {
    MixItem
  }
})
</script>

<style lang="scss" scoped>
.mix-list-container {
  .mix-list,
  .likelist {
    padding-bottom: $gap;
  }
}
.likelist {
  padding-bottom: $padding-lg;
}
</style>

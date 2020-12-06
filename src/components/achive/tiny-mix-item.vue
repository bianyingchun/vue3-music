<template>
  <div class="tiny-mix-item" @click="onClick()">
    <img :src="mix.coverImgUrl" class="cover" />
    <div class="text">
      <div class="name">{{ mix.name }}</div>
      <div class="desc">{{ mix.trackCount }}首歌曲</div>
    </div>
    <div class="tools" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Playlist } from '@/typing'
export default defineComponent({
  props: {
    mix: {
      type: Object as PropType<Playlist>
    },
    isSelect: Boolean
  },
  methods: {
    onClick() {
      if (!this.mix) return
      if (this.isSelect) return this.$emit('select', this.mix)
      this.$router.push(`/playlist/${this.mix.id}`)
    }
  }
})
</script>

<style lang="scss" scoped>
.tiny-mix-item {
  padding: $padding-sm $padding-lg;
  display: flex;
  align-items: center;
  .cover {
    width: 50px;
    height: 50px;
    border-radius: $border-radius;
    margin-right: $gap;
    object-fit: cover;
  }
  .text {
    flex: 1;
    overflow: hidden;
    .name {
      @include text-overflow();
    }
    .desc {
      @include text-overflow();
      color: $text-secondary;
      font-size: $font-size-xs;
    }
  }
}
</style>

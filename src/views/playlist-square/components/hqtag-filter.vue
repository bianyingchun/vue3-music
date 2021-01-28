<template>
  <bottom-panel :show="show" @hide="close()">
    <div class="tag-container">
      <div class="title">选择你喜欢的分类</div>
      <div
        class="tag-item all"
        @click="select('全部')"
        :class="{ active: currentTag === '全部' }"
      >
        全部歌单
      </div>
      <div class="tag-list">
        <div
          class="item tag-item"
          v-for="item in hqTags"
          :key="item.id"
          @click="select(item.name)"
          :class="{ active: currentTag === item.name }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </bottom-panel>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalState } from '@/types'
import * as Types from '@/store/action-types'
import BottomPanel from '@/components/widget/bottom-panel.vue'
export default defineComponent({
  props: {
    show: Boolean,
    currentTag: String
  },
  components: {
    BottomPanel
  },
  setup(props, { emit }) {
    const store = useStore<GlobalState>()
    const hqTags = computed(() => {
      return store.state.playlists.hqTags
    })

    onMounted(() => {
      if (!hqTags.value.length) {
        store.dispatch(`playlists/${Types.SET_HQ_TAGLIST}`)
      }
    })
    function close() {
      emit('update:show', false)
    }
    function select(tag: string) {
      emit('update:currentTag', tag)
      close()
    }
    return {
      hqTags,
      close,
      select
    }
  }
})
</script>

<style lang="scss" scoped>
.tag-container {
  padding: $padding-lg;
  .title {
    margin-bottom: $padding-lg;
  }
  .tag-list {
    @include flex-list($gap, $gap-lg, 4);
  }
  .tag-item.all {
    margin-bottom: $gap-lg;
  }
}
</style>

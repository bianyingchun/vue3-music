<template>
  <span class="tool-panel-trigger">
    <i class="iconfont icon-more" @click.stop="toggle()"></i>
  </span>
  <bottom-panel :show="show" @hide="hide()">
    <div class="tool-panel-container">
      <div class="header">
        {{ title }}
      </div>
      <div class="main">
        <div
          class="tool-item"
          v-for="(item, index) in list"
          :key="index"
          @click="onClick(item)"
        >
          <i :class="['iconfont', item.icon]"></i>
          <span class="text">{{ item.text }}</span>
        </div>
      </div>
    </div>
  </bottom-panel>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import BottomPanel from '../widget/bottom-panel.vue'
interface ToolItem {
  icon: string
  text: string
  action: Function
}

export default defineComponent({
  props: {
    title: String,
    list: Array as PropType<ToolItem[]>
  },
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
    function onClick(item: ToolItem) {
      show.value = false
      item.action()
    }
    return {
      show,
      toggle,
      onClick,
      hide
    }
  }
})
</script>

<style lang="scss" scoped>
.tool-panel-trigger {
  padding: $padding-xs;
  .iconfont {
    color: $gary;
  }
}
.tool-panel-container {
  max-height: 50vh;
  overflow-y: auto;
  .header {
    padding: $padding-lg;
    color: $text-secondary;
    @include border1px($gary, bottom);
  }
  .main {
    padding-bottom: $padding;
    .tool-item {
      padding: $padding $padding-lg;
      display: flex;
      align-items: center;
      overflow: hidden;

      .iconfont {
        margin-right: $gap;
        font-size: $font-size-lg;
      }
      .text {
        @include text-overflow();
      }
    }
  }
}
</style>

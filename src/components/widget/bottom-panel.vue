<template>
  <div class="modal-wraper" v-if="visible">
    <div class="mask" v-show="show" @click.stop="$emit('hide')"></div>
    <transition name="slide-up" @after-leave="afterLeave">
      <div class="content" @click.stop v-show="show">
        <slot> </slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  props: {
    show: Boolean
  },
  setup(props) {
    const visible = ref(props.show)
    function afterLeave() {
      visible.value = false
    }
    watch(
      () => props.show,
      value => {
        visible.value = value
      }
    )
    return {
      visible,
      afterLeave
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-wraper {
  .mask {
    background: $modal-bg;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: $modal-index;
  }
  .content {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    z-index: $modal-index + 1;
    border-radius: $border-radius-lg $border-radius-lg 0 0;
    background: $module-bg;
  }
}
</style>

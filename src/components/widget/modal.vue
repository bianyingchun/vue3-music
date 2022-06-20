<template>
  <div class="modal-wraper">
    <div class="mask" @click.stop="$emit('close')">
      <div class="content" @click.stop>
        <slot> </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss" scoped>
.modal-wraper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: $modal-index;
  .mask {
    width: 100%;
    height: 100%;
    background: $modal-bg;
  }
  .content {
    border-radius: $border-radius-lg;
    position: absolute;
    left: $gap-lg;
    right: $gap-lg;
    top: 50%;
    transform: translateY(-50%);
    overflow: hidden;
    background: $module-bg;
  }
}
</style>

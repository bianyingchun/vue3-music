<template>
  <modal v-if="show" @close="hide()">
    <div class="popup-container" @click.stop>
      <div class="text">
        <span>{{ text }}</span>
      </div>
      <div class="btns">
        <span @click.stop="onCancel" class="cancel">取消</span>
        <span @click.stop="onEnsure" class="ensure">确定</span>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/widget/modal.vue'
export default {
  props: {
    onCancel: Function,
    onEnsure: Function,
    hide: Function,
    text: String,
    show: Boolean
  },
  components: {
    Modal
  }
}
</script>

<style lang="scss" scoped>
.popup-container {
  padding: $padding-lg;
  .text {
    color: $text-secondary;
  }
  .btns {
    margin: $gap-lg 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    span {
      color: $primary;
      margin-right: $gap-lx;
    }
  }
}
</style>

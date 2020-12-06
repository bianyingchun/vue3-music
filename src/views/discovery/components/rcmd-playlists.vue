<template>
  <div>
    <div class="mix-list">
      <mix-item
        v-for="item in list"
        :key="item.id"
        :mix="item"
        class="mix-item"
      ></mix-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Mix } from '@/typing/home'
import MixItem from '@/components/achive/mix-item.vue'
export default defineComponent({
  props: {
    list: Array as PropType<Mix[]>
  },
  components: {
    MixItem
  }
})
</script>

<style lang="scss" scoped>
.mix-list {
  overflow-x: auto;
  white-space: nowrap;
  .mix-item {
    width: 100px;
    margin-right: $gap;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

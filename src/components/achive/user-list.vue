<template>
  <div>
    <div
      class="user-item"
      v-for="item in list"
      :key="item.userId"
      @click="$router.push(`/user/${item.userId}`)"
    >
      <img class="avatar" :src="item.avatarUrl" />
      <div class="text">
        <div class="name">{{ item.nickname }}</div>
        <div class="sub-text" v-if="item.signature">{{ item.signature }}</div>
      </div>
      <span class="follow-status unfollowed" v-if="!item.followed">
        <i class="iconfont icon-add"></i>关注
      </span>
      <span class="follow-status" v-else>
        <i class="iconfont icon-selected"></i>
        已关注</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { User } from '@/types'
export default defineComponent({
  props: {
    list: Array as PropType<User[]>
  }
})
</script>

<style lang="scss" scoped>
.user-item {
  display: flex;
  align-items: center;
  padding: $padding $padding-lg;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
  .text {
    flex: 1;
    overflow: hidden;
    margin: 0 $gap;
    .sub-text {
      @include text-overflow();
    }
  }
  .follow-status {
    width: 60px;
    text-align: center;
    line-height: 24px;
    height: 24px;
    border-radius: 24px;
    border: 1px solid $gary;
    font-size: $font-size-sm;
    .iconfont {
      font-size: $font-size-sm;
    }
    &.unfollowed {
      border-color: $primary;
      color: $primary;
    }
  }
}
</style>

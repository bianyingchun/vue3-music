<template>
  <div class="comment-item">
    <router-link :to="`/user/${comment.user.userId}`" class="avatar">
      <img :src="comment.user.avatarUrl" alt="" class="avatar" />
    </router-link>
    <div class="text">
      <div class="header">
        <div class="title">
          <div class="nickname">{{ comment.user.nickname }}</div>
          <div class="date">{{ formatTime(comment.time) }}</div>
        </div>
        <div class="like-count" :class="{ active: comment.liked }">
          <span class="count">{{ comment.likedCount }}</span>
          <span
            :class="[
              'iconfont',
              comment.liked ? 'icon-like-fill' : 'icon-like'
            ]"
            @click="$emit('toggle-like', comment.commentId, !comment.liked)"
          ></span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div
        class="replied-content"
        v-if="comment.beReplied && comment.beReplied.length"
      >
        <router-link
          :to="`/user/${comment.beReplied[0].user.userId}`"
          class="nickname"
          >@{{ comment.beReplied[0].user.nickname }}</router-link
        >
        :{{ comment.beReplied[0].content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Comment } from '@/typing/comment'
import { formatTime } from '@/common/js/util'
export default defineComponent({
  props: {
    comment: Object as PropType<Comment>
  },
  setup() {
    return {
      formatTime
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: $gap-sm;
    margin-top: $gap-sm;
  }
  .text {
    flex: 1;
    padding: $padding 0;
    @include border1px($gary, bottom);
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $gap;
      .title {
        .nickname {
          color: $text-secondary;
        }
        .date {
          color: $gary;
          font-size: $font-size-xs;
        }
      }
      .like-count {
        color: $gary;
        .iconfont {
          font-size: $font-size-lg;
          margin-left: $gap-xs;
        }
        &.active {
          color: $primary;
        }
      }
    }
    .replied-content {
      padding: $padding-sm;
      color: $text-secondary;
      margin-top: $gap-sm;
      margin-right: $gap-sm;
      .nickname {
        color: $text-link;
      }
    }
  }
}
</style>

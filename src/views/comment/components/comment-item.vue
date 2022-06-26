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
      <div class="comment-body">
        <div class="content">{{ comment.content }}</div>
        <span @click="onTriggerToolbar">
          <i class="iconfont icon-more"></i>
        </span>
      </div>
      <span
        @click="$emit('show-floor')"
        class="reply-count"
        v-if="
          !hideReplyCount &&
            comment.showFloorComment &&
            comment.showFloorComment.replyCount
        "
      >
        {{ comment.showFloorComment.replyCount }}条回复
        <i class="iconfont icon-right"></i>
      </span>
      <div class="replied-content" v-if="showFloorComment(comment)">
        <div v-if="comment.beReplied[0].status">评论已删除</div>
        <div v-else>
          <router-link
            :to="`/user/${comment.beReplied[0].user.userId}`"
            class="nickname"
            >@{{ comment.beReplied[0].user.nickname }}</router-link
          >
          :{{ comment.beReplied[0].content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { Comment } from '@/types'
import { formatTime } from '@/common/js/util'
import { useAuth } from '@/hooks/useAuth'
import { showToolTips } from '@/plugin/tool-tip'
import { popup } from '@/plugin/popup'
export default defineComponent({
  props: {
    comment: Object as PropType<Comment>,
    parentCommentId: Number,
    hideReplyCount: Boolean
  },
  emits: ['show-floor', 'reply', 'delete', 'toggle-like'],
  setup(props, { emit }) {
    const { account, toggleLoginBox } = useAuth()
    const toolList = computed(() => {
      if (!account.value || !props.comment) return []
      const list = [
        {
          title: '回复评论',
          action() {
            emit('reply')
          }
        }
      ]
      account.value.id === props.comment.user.userId &&
        list.push({
          title: '删除评论',
          action() {
            popup('确认删除该条评论？')
              .then(() => {
                emit('delete')
              })
              .catch(() => console.log('canceled'))
          }
        })
      return list
    })
    function onTriggerToolbar() {
      if (!account.value) {
        return toggleLoginBox(true)
      }
      showToolTips(toolList.value)
    }
    function showFloorComment(comment: Comment) {
      return (
        comment.beReplied &&
        comment.beReplied.length &&
        !(comment.beReplied[0].beRepliedCommentId === props.parentCommentId)
      )
    }
    return {
      formatTime,
      showFloorComment,
      onTriggerToolbar
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
    .comment-body {
      display: flex;
      .content {
        flex: 1;
      }
      .icon-more {
        padding: $padding-xs;
        color: $gary;
      }
    }
    .reply-count {
      color: $text-link;
      font-size: $font-size-sm;
      .iconfont {
        font-size: $font-size-sm;
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

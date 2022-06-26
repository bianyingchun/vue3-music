<template>
  <m-page
    :title="`回复(${parentComment.showFloorComment.replyCount})`"
    :onClickBack="()=>$emit('hide')"
    class="reply-page"
  >
    <div class="reply-list-container" ref="refreshElm">
      <div class="parent-comment">
        <comment-item
          :comment="parentComment"
          :hideReplyCount="true"
          @reply="setReplyTarget"
          @delete="$emit('delete-parent')"
          @toggle-like="$emit('toggle-like-parent')"
        />
      </div>
      <div class="reply-list">
        <div class="title">全部回复</div>
        <comment-item
          v-for="item in list"
          :key="item.commentId"
          :comment="item"
          @reply="setReplyTarget(item)"
          @delete="onDelete(item)"
          @toggle-like="onToggleLikeComment"
          :parentCommentId="parentComment.commentId"
        />
      </div>
      <div class="loading" v-if="loading">loading</div>
      <comment-box
        :replyTarget="replyTarget"
        v-model:value="commentText"
        @submit="onAdd"
        @blur="setReplyTarget(null)"
      />
    </div>
  </m-page>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import CommentItem from './comment-item.vue'
import CommentBox from './comment-box.vue'
import { getFloorComment } from '@/common/api/comment'
import { Comment, CommentType } from '@/types'
import { showToast } from '@/plugin/toast'
import { useCommentList } from '@/hooks/useComment'
import { useLoadMore } from '@/hooks/useLoadMore'

export default defineComponent({
  props: {
    id: Number,
    type: Number as PropType<CommentType>,
    parentComment: Object as PropType<Comment>
  },
  emits: [
    'toggle-like-parent',
    'delete-parent',
    'add-reply',
    'delete-reply',
    'hide'
  ],
  components: {
    CommentItem,
    CommentBox
  },
  setup(props, { emit }) {
    const { id, type, parentComment } = props as {
      id: number
      type: CommentType
      parentComment: Comment
    }
    const {
      list,
      onDeleteComment,
      onAddComment,
      onToggleLikeComment,
      updateCommentItem,
      replyTarget,
      setReplyTarget,
      commentText
    } = useCommentList(id, type, parentComment)
    const refreshElm = ref<null | HTMLElement>(null)
    const loading = ref(false)
    const pageInfo = {
      time: 0,
      hasMore: true
    }
    const parentCommentId = parentComment && parentComment.commentId
    async function getList() {
      try {
        if (loading.value || !pageInfo.hasMore) return
        loading.value = true
        const params: any = {
          id: parentCommentId,
          type
        }
        if (list.value.length) {
          params.time = list.value[list.value.length - 1].time
        }
        const res = await getFloorComment({
          id,
          parentCommentId,
          type
        })
        const { comments, hasMore, time } = res.data.data
        list.value = [...list.value, ...comments]
        pageInfo.hasMore = hasMore
        pageInfo.time = time
      } catch (err) {
        showToast('加载失败')
      } finally {
        loading.value = false
      }
    }
    useLoadMore(refreshElm, getList)
    getList()
    async function onAdd() {
      const comment = await onAddComment()
      if (comment) emit('add-reply')
      return comment
    }
    async function onDelete(comment: Comment) {
      const res = await onDeleteComment(comment)
      if (res) {
        emit('delete-reply', comment)
      }
      return res
    }

    return {
      list,
      loading,
      onAdd,
      onDelete,
      onToggleLikeComment,
      updateCommentItem,
      replyTarget,
      setReplyTarget,
      commentText,
      refreshElm
    }
  }
})
</script>

<style lang="scss" scoped>
.reply-page {
  height: calc(100vh - 60px);
}
.reply-list-container {
  padding: 0 $padding-lg 60px;
  box-sizing: border-box;
  .parent-comment {
    .reply-count {
      display: none;
    }
    margin-bottom: $gap-lg;
  }
  .reply-list {
    .title {
      font-weight: bold;
      padding: $padding 0;
    }
  }
}
</style>

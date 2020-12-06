<template>
  <m-page :title="`评论(${total})`">
    <div class="comment-container" ref="refreshElm">
      <div class="navbar-container">
        <div class="navbar">
          <span class="title">评论区</span>
          <div class="list">
            <template v-for="(item, index) in sortTypeList" :key="index">
              <span
                class="nav-item"
                @click="toggleSortType(index)"
                :class="{ active: sortIndex === index }"
                >{{ item.text }}</span
              >
              <span
                class="divide"
                v-if="index < sortTypeList.length - 1"
              ></span>
            </template>
          </div>
        </div>
      </div>
      <div class="comment-list">
        <comment-item
          v-for="(item, index) in list"
          :key="index"
          :comment="item"
          @toggle-like="toggleLike"
          @click="reply(item)"
          v-longpress="onPressItem(item)"
        ></comment-item>
      </div>
    </div>
  </m-page>
  <div class="comment-box">
    <div
      contenteditable="true"
      class="comment-input"
      @keydown="onInput"
      :placeholder="placeholder"
      @blur="exitReply"
    ></div>
    <button class="submit-btn" :disabled="!btnEnable" @click="sendComment">
      发送
    </button>
  </div>
</template>

<script lang="ts">
// todo 长按显示操作面板 删除 ，toast 提示
import { computed, defineComponent, ref, watch } from 'vue'
import { Comment, CommentType } from '@/typing/comment.ts'
import {
  getCommentList,
  likeComment,
  addComment,
  deleteComment
} from '@/common/api/comment'
import { useRoute } from 'vue-router'
import CommentItem from './components/comment-item.vue'
import { useLoadMore } from '@/hooks/useLoadMore'
import { showToast } from '@/plugin/toast'
import { showToolTips } from '@/plugin/tool-tip'
import { useStore } from 'vuex'
import { GlobalState } from '@/typing'
import { COMMENT } from '@/common/js/config'
export default defineComponent({
  components: {
    CommentItem
  },
  setup() {
    const route = useRoute()
    const { id, type } = route.params
    const sourceId = Number(id)
    const sourceType = COMMENT.type[type as CommentType]
    const list = ref([] as Comment[])
    const hasMore = ref(true)
    const loading = ref(false)
    const total = ref(0)
    const sortTypeList =
      type === 'music' ? COMMENT.sortType.music : COMMENT.sortType.other
    const sortIndex = ref(0)
    function toggleSortType(index: number) {
      sortIndex.value = index
    }

    const pageInfo = {
      pageNo: 1,
      pageSize: 20
    }
    // cursor: 当sortType为3时且页数不是第一页时需传入,值为上一条数据的time

    async function getList() {
      if (!hasMore.value || loading.value) return
      loading.value = true
      const sortType = sortTypeList[sortIndex.value].val
      const opts: any = {
        ...pageInfo,
        sortType
      }
      if (sortType === 3 && pageInfo.pageNo > 1) {
        opts.cursor = list.value[list.value.length - 1].time
      }
      const res = await getCommentList(sourceId, sourceType, opts)
      loading.value = false
      hasMore.value = res.hasMore
      list.value = [...list.value, ...res.comments]
      total.value = res.totalCount
      pageInfo.pageNo++
    }
    watch(
      sortIndex,
      async () => {
        pageInfo.pageNo = 1
        hasMore.value = true
        list.value = []
        await getList()
      },
      { immediate: true }
    )

    const refreshElm = ref<null | HTMLElement>(null)
    useLoadMore(refreshElm, getList)

    // like comment
    function _togglelikeCommentItem(id: number, islike: boolean) {
      const index = list.value.findIndex(item => item.commentId === id)
      if (index < 0) return
      const item = list.value[index]
      if (islike) {
        item.likedCount += 1
      } else {
        item.likedCount -= 1
      }
      item.liked = islike
    }
    let postLoading = false
    async function toggleLike(cid: number, islkie: boolean) {
      if (postLoading) return
      postLoading = true
      await likeComment({
        id: sourceId,
        t: islkie ? 1 : 0,
        cid,
        type: sourceType
      })
      _togglelikeCommentItem(cid, islkie)
      postLoading = false
    }

    //add comment
    const commentContent = ref('')
    const replyTarget = ref<Comment | null>()
    const placeholder = computed(() => {
      if (commentContent.value) return ''
      return replyTarget.value
        ? `回复${replyTarget.value.user.nickname}:`
        : '千头万绪，落笔汇成评论一句'
    })
    const btnEnable = computed(() => {
      return commentContent.value.length
    })
    function onInput(e: KeyboardEvent) {
      const t = e.target as HTMLDivElement
      commentContent.value = t.innerText
    }
    function _addCommentItem(item: Comment) {
      list.value.unshift(item)
    }
    async function sendComment() {
      const content = commentContent.value.trim()
      if (!content) {
        return showToast('请输入文本')
      }
      const params: any = {
        id: sourceId,
        t: replyTarget.value ? 2 : 1,
        type: sourceType,
        content: content
      }
      if (replyTarget.value) {
        params.commentId = replyTarget.value.commentId
      }
      const res = await addComment(params)
      _addCommentItem(res.data.comment)
      commentContent.value = ''
    }
    // reply comment
    function reply(item: Comment) {
      replyTarget.value = item
    }
    function exitReply() {
      replyTarget.value = null
    }
    //delete comment
    function _deleteCommentItem(id: number) {
      const index = list.value.findIndex(item => item.commentId === id)
      if (index < 0) return
      list.value.splice(index, 1)
    }
    async function deleteCommentItem(commentId: number) {
      await deleteComment({
        id: sourceId,
        type: sourceType,
        commentId
      })
      _deleteCommentItem(commentId)
    }
    const store = useStore<GlobalState>()
    function onPressItem(item: Comment) {
      return () => {
        if (item.user.userId === store.state.auth.account?.id) {
          return showToolTips([
            {
              title: '删除评论',
              action: () => {
                deleteCommentItem(item.commentId)
              }
            }
          ])
        }
      }
    }
    return {
      list,
      hasMore,
      total,
      loading,
      refreshElm,
      toggleLike,
      onInput,
      btnEnable,
      sendComment,
      placeholder,
      reply,
      exitReply,
      deleteCommentItem,
      onPressItem,
      toggleSortType,
      sortIndex,
      sortTypeList
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-container {
  height: 100%;
  overflow-y: auto;
}
.navbar-container {
  position: relative;
  height: 50px;
  .navbar {
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 $padding-lg;
    align-items: center;
    .list {
      display: flex;
      align-items: center;
      margin-right: -$padding;
      .nav-item {
        padding: 0 $padding;
        color: $gary;
        &.active {
          color: $text;
        }
      }
      .divide {
        height: $font-size;
        width: 1px;
        background: $gary;
      }
    }
  }
}
.comment-list {
  padding: 0 $padding-lg 2 * $padding-lg;
}
.comment-box {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  background: $module-bg;
  padding: $padding-lg;
  display: flex;
  align-items: flex-end;
  .comment-input {
    flex: 1;
    margin-right: $gap;
    max-height: 60px;
    overflow: hidden;
    &:focus {
      outline: none;
    }
  }
  .submit-btn {
    background: transparent;
  }
  .comment-input::after {
    content: attr(placeholder);
    position: absolute;
    color: $gary;
  }
}
</style>

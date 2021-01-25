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
          :key="item.commentId"
          :comment="item"
          @toggle-like="onToggleLikeComment"
          @reply="setReplyTarget(item)"
          @show-floor="setFloorCommentIndex(index)"
          @delete="onDeleteParent(item)"
        ></comment-item>
      </div>
    </div>
  </m-page>
  <comment-box
    :replyTarget="replyTarget"
    v-model:value="commentText"
    @submit="AddParentComment"
    @blur="setReplyTarget(null)"
  ></comment-box>
  <bottom-panel :show="!!floorComment" @hide="setFloorCommentIndex(-1)">
    <reply-list
      :parentComment="floorComment"
      :id="sourceId"
      :type="sourceType"
      @delete-parent="onDeleteParent(floorComment)"
      @delete-reply="updateCountOnDeleteComment($event, floorComment)"
      @add-reply="updateCountOnAddComment(floorComment)"
      @toggle-like-parent="
        onToggleLikeComment(floorComment.commentId, !floorComment.liked)
      "
    ></reply-list>
  </bottom-panel>
</template>

<script lang="ts">
// todo 长按显示操作面板 删除 ，toast 提示
import { computed, defineComponent, ref, watch } from 'vue'
import CommentItem from './components/comment-item.vue'
import CommentBox from './components/comment-box.vue'
import ReplyList from './components/reply-list.vue'
import BottomPanel from '@/components/widget/bottom-panel.vue'
import { getCommentList } from '@/common/api/comment'
import { useRoute } from 'vue-router'
import { useLoadMore } from '@/hooks/useLoadMore'
import { showToast } from '@/plugin/toast'
import { Comment, CommentType, CommentTypeNames } from '@/types'
import { COMMENT } from '@/common/js/config'
import { useCommentList } from '@/hooks/useComment'

export default defineComponent({
  components: {
    CommentItem,
    CommentBox,
    BottomPanel,
    ReplyList
  },
  setup() {
    const route = useRoute()
    const { id, type } = route.params
    const sourceId = Number(id)
    const sourceType = CommentType[type as CommentTypeNames]
    const hasMore = ref(true)
    const loading = ref(false)
    const total = ref(0)
    const sortTypeList =
      sourceType === CommentType.music
        ? COMMENT.sortType.music
        : COMMENT.sortType.other
    const {
      list,
      onDeleteComment,
      onAddComment,
      replyTarget,
      setReplyTarget,
      commentText,
      onToggleLikeComment,
      updateCommentItem
    } = useCommentList(sourceId, sourceType)
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
      try {
        const res = await getCommentList(sourceId, sourceType, opts)
        loading.value = false
        hasMore.value = res.hasMore
        list.value = [...list.value, ...res.comments]
        total.value = res.totalCount
        pageInfo.pageNo++
      } catch (err) {
        showToast('加载失败')
      } finally {
        loading.value = false
      }
    }
    watch(sortIndex, async () => {
      pageInfo.pageNo = 1
      hasMore.value = true
      list.value = []
      await getList()
    })
    const refreshElm = ref<null | HTMLElement>(null)
    useLoadMore(refreshElm, getList)
    getList()
    const floorCommentIndex = ref(-1)
    const floorComment = computed(() => list.value[floorCommentIndex.value])
    function setFloorCommentIndex(value: number) {
      floorCommentIndex.value = value
    }
    function updateCountOnAddComment(
      parentComment?: Comment // 楼层下新增评论(新增回复)
    ) {
      // 新增一条回复
      // 新增一条comment
      const addCount = 1
      if (parentComment) {
        const showFloorComment = parentComment.showFloorComment || {
          replyCount: 0,
          showReplyCount: true
        }
        updateCommentItem({
          ...parentComment,
          showFloorComment: {
            ...showFloorComment,
            replyCount: showFloorComment.replyCount + 1
          }
        })
      }
      total.value = total.value + addCount
    }
    function updateCountOnDeleteComment(
      deletedComment: Comment,
      parentComment?: Comment
    ) {
      // 1. 删除楼层下的某条回复
      // 2. 有回复的评论
      // 3. 无回复无楼层的评论
      let deletedCount = 1
      if (parentComment) {
        const showFloorComment = parentComment.showFloorComment
        if (showFloorComment) {
          updateCommentItem({
            ...parentComment,
            showFloorComment: {
              ...showFloorComment,
              replyCount: showFloorComment.replyCount - 1
            }
          })
        }
      } else {
        deletedCount += deletedComment.showFloorComment
          ? deletedComment.showFloorComment.replyCount
          : 0
      }
      total.value = total.value - deletedCount
    }

    async function AddParentComment(value: string) {
      const res = await onAddComment(value)
      res && updateCountOnAddComment()
      return res
    }

    async function onDeleteParent(comment: Comment) {
      const res = await onDeleteComment(comment)
      if (res) {
        updateCountOnDeleteComment(comment)
        setFloorCommentIndex(-1)
      }
    }
    return {
      list,
      hasMore,
      total,
      loading,
      refreshElm,
      sourceId,
      sourceType,
      onToggleLikeComment,
      commentText,
      onDeleteParent,
      onAddComment,
      AddParentComment,
      updateCountOnDeleteComment,
      updateCountOnAddComment,
      toggleSortType,
      sortIndex,
      sortTypeList,
      setReplyTarget,
      replyTarget,
      floorComment,
      setFloorCommentIndex
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-container {
  height: 100%;
  overflow-y: auto;
  margin-bottom: 60px;
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

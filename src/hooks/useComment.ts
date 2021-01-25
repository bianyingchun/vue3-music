import { ref } from 'vue'
import { likeComment, addComment, deleteComment } from '@/common/api/comment'
import { showToast } from '@/plugin/toast'
import { Comment, CommentType } from '@/types'
export function useCommentList(
  sourceId: number,
  sourceType: CommentType,
  parentComment?: Comment
) {
  const list = ref<Comment[]>([])
  async function onToggleLikeComment(cid: number, islike: boolean) {
    try {
      await likeComment({
        id: sourceId,
        t: islike ? 1 : 0,
        cid,
        type: sourceType
      })
      const index = list.value.findIndex(item => item.commentId === cid)
      if (index < 0) return
      const item = list.value[index]
      if (islike) {
        item.likedCount += 1
      } else {
        item.likedCount -= 1
      }
      item.liked = islike
      console.log(item.liked)
      // list.value.splice(index, 1, item)
    } catch (err) {
      showToast('请求失败')
    }
  }
  const replyTarget = ref<Comment | null>(parentComment || null)
  function setReplyTarget(target: Comment | null) {
    replyTarget.value = target || parentComment || null
  }
  function _addCommentItem(comment: Comment) {
    list.value.unshift(comment)
  }
  function updateCommentItem(comment: Comment) {
    const index = list.value.findIndex(
      item => item.commentId === comment.commentId
    )
    index >= 0 && list.value.splice(index, 1, comment)
  }
  const commentText = ref('')
  // 添加评论
  async function onAddComment(value?: string) {
    console.log(value, commentText.value)
    const params: any = {
      id: sourceId,
      t: replyTarget.value ? 2 : 1,
      type: sourceType,
      content: commentText.value
    }
    let comment: Comment | null = null

    if (replyTarget.value) {
      params.commentId = replyTarget.value.commentId
    }
    try {
      const res = await addComment(params)
      if (!res.data.comment) return showToast(res.data.msg || '评论失败')
      comment = res.data.comment
      if (parentComment) {
        // 回复列表回复
        if (replyTarget.value) {
          const { commentId, user, content } = replyTarget.value
          if (replyTarget.value.commentId !== parentComment.commentId) {
            comment = {
              ...comment,
              beReplied: [
                {
                  user,
                  beRepliedCommentId: commentId,
                  content,
                  status: 0
                }
              ]
            }
            _addCommentItem(comment)
          }
        }
      } else {
        //评论列表回复
        if (!replyTarget.value) {
          _addCommentItem(comment)
        } else {
          const showFloorComment = replyTarget.value.showFloorComment || {
            replyCount: 0,
            showReplyCount: true
          }
          updateCommentItem({
            ...replyTarget.value,
            showFloorComment: {
              ...showFloorComment,
              replyCount: showFloorComment.replyCount + 1
            }
          })
        }
      }
      commentText.value = ''
      setReplyTarget(null)
    } catch (err) {
      if (err.response.status === 405) {
        showToast(err.response.data.message || '请求过于频繁')
      } else {
        showToast('请求失败')
      }
    } finally {
      setReplyTarget(null)
    }
    return comment
  }

  // 删除评论
  async function onDeleteComment(comment: Comment) {
    const commentId = comment.commentId
    let deleted = false
    try {
      await deleteComment({
        id: sourceId,
        type: sourceType,
        commentId
      })
      const index = list.value.findIndex(item => item.commentId === commentId)
      if (index < 0) return false
      deleted = true
      list.value.splice(index, 1)
    } catch (err) {
      deleted = false
      showToast('删除失败')
    }
    return deleted
  }

  return {
    list,
    onDeleteComment,
    onAddComment,
    onToggleLikeComment,
    updateCommentItem,
    replyTarget,
    setReplyTarget,
    commentText
  }
}

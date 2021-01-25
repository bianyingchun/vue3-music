import { CommentList, CommentType, FloorCommentData, Comment } from '@/types'

import request from './request'
export interface CommentOpts {
  pageNo?: number
  pageSize?: number
  sortType?: number
  cursor?: number
}
export async function getCommentList(
  id: number,
  type: number,
  opts: CommentOpts = {}
) {
  const res = await request<CommentList>('/comment/new', 'get', {
    id,
    type,
    ...opts,
    timestamp: Date.now()
  })
  return res.data.data
}
// interface CommentParams {
//   limit?: number
//   before?: number
//   offset?: number
// }
// export function getCommentList(
//   id: string,
//   type: CommentType,
//   opts: CommentParams = {}
// ) {
//   return request<CommentList>('/comment/' + type, 'get', { id, ...opts })
// }

// export function getHotComment(
//   id: string,
//   type: CommentType,
//   opts: CommentParams = {}
// ) {
//   return request<HotCommentList>('/comment/hot', 'get', {
//     id,
//     type: COMMENT_TYPE[type],
//     timestamp: Date.now(),
//     ...opts
//   })
// }

// /comment/like?id=29178366&cid=12840183&t=1&type=0
// 必选参数 : id : 资源 id, 如歌曲 id,mv id
// cid : 评论 id
// t : 是否点赞 ,1 为点赞 ,0 为取消点赞
// tpye: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
export function likeComment(params: {
  id: number
  cid: number
  t: 1 | 0
  type: CommentType
}) {
  return request<any>('/comment/like', 'get', {
    ...params,
    timestamp: Date.now()
  })
}
// /comment?t=1&type=1&id=5436712&content=test

export function addComment(params: {
  id: number
  t: 1 | 2 //t:1 发送, 2 回复
  type: CommentType
  content: string
  commentId?: number
}) {
  return request<{ comment?: Comment; code: number; msg: string }>(
    '/comment',
    'get',
    {
      ...params,
      timestamp: Date.now()
    }
  )
}

export async function deleteComment(params: {
  id: number
  type: CommentType
  commentId?: number
}) {
  return request<any>('/comment', 'get', {
    ...params,
    t: 0,
    timestamp: Date.now()
  })
}

export function getFloorComment(params: {
  parentCommentId: number
  id: number
  type: CommentType
  time?: number
  limit?: number
}) {
  return request<FloorCommentData>('/comment/floor', 'get', {
    ...params,
    timestamp: Date.now()
  })
}

import { User } from './user'
export interface CommentList {
  code: number
  data: {
    comments: Comment[]
    currentComment?: any
    totalCount: number
    hasMore: boolean
    cursor: string
    sortType: number
    sortTypeList: SortTypeList[]
  }
}

interface SortTypeList {
  sortType: number
  sortTypeName: string
  target: string
}
export interface Comment {
  user: User
  beReplied: BeReplied[]
  pendantData?: PendantDatum
  showFloorComment?: ShowFloorComment
  status: number
  commentId: number
  content: string
  time: number
  likedCount: number
  expressionUrl?: any
  commentLocationType: number
  parentCommentId: number
  decoration: Record<string, any>
  repliedMark?: any
  liked: boolean
}
interface ShowFloorComment {
  replyCount: number
  comments?: Comment
  showReplyCount: boolean
  topCommentIds?: number
  target?: any
}
interface BeReplied {
  user: User
  beRepliedCommentId: number
  content: string
  status: number
  expressionUrl?: any
}
interface PendantDatum {
  id: number
  imageUrl: string
}

export enum CommentType {
  music = 0,
  mv,
  playlist,
  album,
  dj,
  video
}

export type CommentTypeNames = 'music' | 'mv' | 'album' | 'dj' | 'video'

export interface FloorCommentData {
  code: number
  message: string
  data: {
    ownerComment: Comment
    currentComment?: any
    comments: Comment[]
    hasMore: boolean
    totalCount: number
    time: number
  }
}

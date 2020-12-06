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
  showFloorComment?: any
  status: number
  commentId: number
  content: string
  time: number
  likedCount: number
  expressionUrl?: any
  commentLocationType: number
  parentCommentId: number
  decoration: Decoration
  repliedMark?: any
  liked: boolean
}

interface Decoration {
  [props: string]: any
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
export interface User {
  locationInfo?: any
  liveInfo?: any
  anonym: number
  userId: number
  avatarDetail?: AvatarDetail
  userType: number
  remarkName?: any
  vipRights?: VipRight
  nickname: string
  avatarUrl: string
  authStatus: number
  expertTags?: any
  experts?: any
  vipType: number
}

export interface VipRight {
  associator?: Associator
  musicPackage?: any
  redVipAnnualCount: number
  redVipLevel: number
}

interface Associator {
  vipCode: number
  rights: boolean
}

interface AvatarDetail {
  userType: number
  identityLevel?: any
  identityIconUrl: string
}

export type CommentType = 'music' | 'album' | 'dj' | 'video' | 'mv'

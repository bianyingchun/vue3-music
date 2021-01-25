import request from './request'
import {
  LoginStatus,
  UserPlaylistData,
  UserDetail,
  UserRecord,
  Playlist,
  PageParams,
  FollowList,
  FollowedList
} from '@/types'
interface LoginPhoneParams {
  phone: string
  password: string
}
export function loginByPhone(params: LoginPhoneParams) {
  // ?phone=xxx&password=yyy
  return request<LoginStatus>('/login/cellphone', 'post', {
    ...params,
    timestamp: Date.now()
  })
}

export function loginRefresh() {
  return request<any>('/login/refresh', 'get', { timestamp: Date.now() })
}

export function getAccount() {
  return request<LoginStatus>('/user/account', 'get', {
    timestamp: Date.now()
  })
}

export function getLoginStatus() {
  return request<LoginStatus>('/login/status', 'get', {
    timestamp: Date.now()
  })
}

export async function getUserPlaylist(uid: number) {
  const res = await request<UserPlaylistData>('/user/playlist', 'get', {
    uid,
    timestamp: Date.now()
  })
  const list = res.data.playlist
  let likelist = {} as Playlist
  const created: Playlist[] = []
  const faved: Playlist[] = []

  list.forEach(item => {
    if (item.specialType === 5) {
      likelist = item
    } else if (item.userId === uid) {
      created.push(item)
    } else {
      faved.push(item)
    }
  })
  return {
    likelist,
    created,
    faved
  }
}

export function getUserDetail(uid: number) {
  return request<UserDetail>('user/detail', 'get', {
    uid,
    timestamp: Date.now()
  })
}

// 听歌记录 type=0 所有时间 type =1 最近一周
export function getUserRecord(uid: number, type = 0) {
  return request<UserRecord>('/user/record', 'get', { uid, type })
}

//粉丝列表
export function getFollowedList(uid: number, params: PageParams = {}) {
  return request<FollowedList>('/user/followeds', 'get', { uid, ...params })
}
//关注列表
export function getFollowList(uid: number, params: PageParams = {}) {
  return request<FollowList>('/user/follows', 'get', { uid, ...params })
}

export async function getlikelistIds(uid: number) {
  const res = await request<any>('/likelist', 'get', {
    uid,
    timestamp: Date.now()
  })
  return res.data.ids as number[]
}

// 关注/取关
// id : 用户 id
// t : 1为关注,其他为取消关注
export function followUser(uid: number, follow: boolean) {
  return request<any>('/follow', 'post', {
    uid,
    t: follow ? 1 : 0,
    timestamp: Date.now()
  })
}

// 登出
export function logout() {
  return request<any>('/logout', 'post', { timestamp: Date.now() })
}

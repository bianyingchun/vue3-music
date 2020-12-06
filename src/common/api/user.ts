import request from './request'
import {
  AuthState,
  UserPlaylistData,
  UserDetail,
  UserRecord,
  Playlist,
  PageParams,
  FollowList,
  FollowedList
} from '@/typing'
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface ILoginPhoneParams {
  phone: string
  password: string
}
export function loginByPhone(params: ILoginPhoneParams) {
  // ?phone=xxx&password=yyy
  return request<AuthState>('/login/cellphone', 'post', params)
}

export function loginRefresh() {
  return request<any>('/login/refresh', 'get')
}

export function getAccount() {
  return request<AuthState>('/user/account', 'get')
}

export function getLoginStatus() {
  return request<AuthState>('/login/status', 'get')
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
  return request<UserDetail>('user/detail', 'get', { uid })
}

// 听歌记录 type=0 所有时间 type =1 最近一周
export function getUserRecord(uid: number, type = 0) {
  return request<UserRecord>('/user/record', 'get', { uid, type })
}

//粉丝列表
export function getFollowedList(uid: number, params: PageParams = {}) {
  return request<FollowedList>('/user/followeds', 'get', { uid, ...params })
}
//关注
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

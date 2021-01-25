import { Module } from 'vuex'
import { GlobalState, AuthState, LoginStatus } from '@/types'
import * as Types from '../action-types'
import { loginByPhone, getAccount, logout } from '@/common/api/user'
import { showToast } from '@/plugin/toast'
const state: AuthState = {
  logined: false,
  profile: undefined,
  account: undefined,
  isLogining: false,
  loginVisible: false,
  isLogouting: false
}
const authModule: Module<AuthState, GlobalState> = {
  namespaced: true,
  state: state,
  mutations: {
    [Types.SET_ACCOUNT](state, payload: LoginStatus) {
      state.account = payload.account
      state.profile = payload.profile
      state.logined = !!payload.account
    },
    [Types.SET_LOGIN_VISIBLE](state, payload: boolean) {
      state.loginVisible = payload
    },
    [Types.SET_IS_LOGINING](state, payload: boolean) {
      state.isLogining = payload
    },
    [Types.SET_IS_LOGOUTING](state, payload: boolean) {
      state.isLogouting = payload
    }
  },
  actions: {
    async login(
      { commit, dispatch },
      payload: { account: string; password: string }
    ) {
      try {
        if (state.isLogining) return
        commit(Types.SET_IS_LOGINING, true)
        const res = await loginByPhone({
          phone: payload.account,
          password: payload.password
        })
        commit(Types.SET_ACCOUNT, res.data)
        commit(Types.SET_LOGIN_VISIBLE, false)
        const account = res.data.account
        if (account) {
          dispatch('playlists/fetchPlaylist', account.id, { root: true })
          dispatch('playlists/fetchLikelistIds', account.id, { root: true })
        }
        return res
      } catch (err) {
        showToast('登录失败')
        commit(Types.SET_ACCOUNT, {
          account: null
        })
      } finally {
        commit(Types.SET_IS_LOGINING, false)
      }
    },
    async checkLogin({ commit, dispatch }) {
      try {
        const res = await getAccount()
        const { profile, account } = res.data
        commit(Types.SET_ACCOUNT, {
          profile,
          account
        })
        if (account) {
          dispatch('playlists/fetchPlaylist', account.id, { root: true })
          dispatch('playlists/fetchLikelistIds', account.id, { root: true })
        }
      } catch (err) {
        commit(Types.SET_ACCOUNT, {
          profile: null,
          account: null
        })
      }
    },
    async logout({ commit, state, dispatch }) {
      try {
        if (state.isLogouting) return
        commit(Types.SET_IS_LOGOUTING, true)
        const res = await logout()
        commit(Types.SET_ACCOUNT, {
          profile: null,
          account: null
        })
        dispatch('playlists/clearUserPlaylist', null, { root: true })
        return res
      } catch (err) {
        showToast('登出失败')
      } finally {
        commit(Types.SET_IS_LOGOUTING, false)
      }
    }
  }
}

export default authModule

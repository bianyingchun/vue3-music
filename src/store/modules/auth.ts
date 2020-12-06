import { Module } from 'vuex'
import { GlobalState, AuthState, Profile, Account } from '@/typing/index'
import * as Types from '../action-types'
import { loginByPhone, getAccount } from '@/common/api/user'
const state: AuthState = {
  logined: false,
  profile: undefined,
  account: undefined
}
const authModule: Module<AuthState, GlobalState> = {
  namespaced: true,
  state: state,
  mutations: {
    [Types.SET_ACCOUNT](
      state,
      payload: {
        profile: Profile
        account: Account
      }
    ) {
      state.account = payload.account
      state.profile = payload.profile
      state.logined = !!payload.account
    }
  },
  actions: {
    async login({ commit }, payload: { account: string; password: string }) {
      const res = await loginByPhone({
        phone: payload.account,
        password: payload.password
      })
      commit(Types.SET_ACCOUNT, {
        profile: res.data.profile,
        account: res.data.account
      })
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
    }
  }
}

export default authModule

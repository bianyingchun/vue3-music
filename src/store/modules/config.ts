import { Module } from 'vuex'
import { THEME_TYPES, GlobalState, ConfigState } from '@/typing/index'
import * as Types from '../action-types'
const state: ConfigState = {
  theme: 'dark'
}
const configModule: Module<ConfigState, GlobalState> = {
  namespaced: true,
  state: state,
  mutations: {
    [Types.SET_CONFIG_THEME](state, payload: THEME_TYPES) {
      state.theme = payload
    }
  }
}

export default configModule

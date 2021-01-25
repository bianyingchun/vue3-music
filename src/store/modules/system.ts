import { Module } from 'vuex'
import { GlobalState, SystemState, Theme } from '@/types'
import * as Types from '../action-types'
import { THEME_LIST } from '@/common/js/config'
import { loadTheme, saveTheme } from '@/common/js/cache'
const state: SystemState = {
  theme: {
    list: THEME_LIST,
    current: (loadTheme() as Theme) || Theme.dark
  }
}
const configModule: Module<SystemState, GlobalState> = {
  namespaced: true,
  state: state,
  mutations: {
    [Types.SET_SYSYTEM_THEME](state, payload: Theme) {
      state.theme.current = payload
      saveTheme(payload)
    }
  }
}

export default configModule

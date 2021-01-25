import { Module } from 'vuex'
import * as Types from '../action-types'
import { GlobalState, SearchState } from '@/types'
import {
  loadSearch,
  saveSearch,
  clearSearch,
  deleteSearch
} from '@/common/js/cache'
const state: SearchState = {
  history: loadSearch()
}

const searchModule: Module<SearchState, GlobalState> = {
  namespaced: true,
  state,
  mutations: {
    [Types.SET_SEARCH_HISTORY](state, payload: string[]) {
      state.history = payload
    }
  },
  actions: {
    saveSearchHistory({ commit }, payload: string) {
      commit(Types.SET_SEARCH_HISTORY, saveSearch(payload))
    },
    clearSearchHistory({ commit }) {
      commit(Types.SET_SEARCH_HISTORY, clearSearch())
    },
    deleteSearchHistory({ commit }, payload: string) {
      commit(Types.SET_SEARCH_HISTORY, deleteSearch(payload))
    }
  }
}

export default searchModule

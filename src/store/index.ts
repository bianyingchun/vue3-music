import { createStore } from 'vuex'
import { GlobalState } from '@/types'
import playlists from './modules/playlists'
import system from './modules/system'
import player from './modules/player'
import auth from './modules/auth'
import search from './modules/search'
export default createStore<GlobalState>({
  mutations: {},
  actions: {},
  modules: {
    playlists,
    system,
    player,
    auth,
    search
  }
})

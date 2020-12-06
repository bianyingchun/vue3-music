import { createStore } from 'vuex'
import { GlobalState } from '@/typing/index.ts'
import playlists from './modules/playlists'
import config from './modules/config'
import player from './modules/player'
import auth from './modules/auth'
export default createStore<GlobalState>({
  mutations: {},
  actions: {},
  modules: {
    playlists,
    config,
    player,
    auth
  }
})

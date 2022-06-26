import { defineStore } from 'pinia'

import {
  loadSearch,
  saveSearch,
  clearSearch,
  deleteSearch
} from '@/common/js/cache'

const useSearchHistory = defineStore('search', {
  state: () => ({
    history: loadSearch()
  }),
  actions: {
    saveSearchHistory(payload: string) {
      this.history = saveSearch(payload)
    },
    clearSearchHistory() {
      this.history = []
      clearSearch()
    },
    deleteSearchHistory(payload: string) {
      this.history = deleteSearch(payload)
    }
  }
})

export default useSearchHistory

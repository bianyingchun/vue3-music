import { defineStore } from 'pinia'

import { Theme } from '@/types'
import { THEME_LIST } from '@/common/js/config'
import { loadTheme, saveTheme } from '@/common/js/cache'

const useSystemStore = defineStore('system', {
  state: () => ({
    theme: {
      list: THEME_LIST,
      current: (loadTheme() as Theme) || Theme.dark
    }
  }),
  actions: {
    setSystemTheme(theme: Theme) {
      this.theme.current = theme
      saveTheme(theme)
    }
  }
})
export default useSystemStore

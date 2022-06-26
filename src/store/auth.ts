import { defineStore } from 'pinia'
import md5 from 'md5'
import { Profile, Account, LoginStatus } from '@/types'
import { loginByPhone, getAccount, logout } from '@/common/api/user'
import { showToast } from '@/plugin/toast'
import usePlaylistsStore from './playlists'

const useAuthStore = defineStore('auth', {
  state: () => ({
    logined: false,
    profile: null as Profile | null,
    account: null as Account | null,
    isLogining: false,
    loginVisible: false,
    isLogouting: false
  }),
  actions: {
    setAccount(payload: Pick<LoginStatus, 'account' | 'profile'>) {
      this.account = payload.account || null
      this.profile = payload.profile || null
      this.logined = !!payload.account
    },
    async login(payload: { account: string; password: string }) {
      try {
        if (this.isLogining) return
        this.isLogining = true
        const res = await loginByPhone({
          phone: payload.account,
          md5_password: md5(payload.password)
        })
        if (res.data.code !== 200) {
          showToast(res.data.message || res.data.msg || '登录失败')
        } else {
          this.setAccount(res.data)
          this.loginVisible = false
          const account = res.data.account
          if (account) {
            const store = usePlaylistsStore()
            store.fetchPlaylist(account.id)
            store.fetchLikelistIds(account.id)
          }
        }
      } catch (err) {
        console.log(err)
        showToast('登录失败')
        this.account = null
        this.profile = null
        this.setAccount({})
      } finally {
        this.isLogining = false
      }
    },
    async checkLogin() {
      try {
        const res = await getAccount()
        const { profile, account } = res.data
        this.setAccount({
          profile,
          account
        })
        if (account) {
          const store = usePlaylistsStore()
          store.fetchPlaylist(account.id)
          store.fetchLikelistIds(account.id)
        }
      } catch (err) {
        this.setAccount({})
      }
    },
    async logout() {
      try {
        if (this.isLogouting) return
        this.isLogouting = true
        const res = await logout()
        this.setAccount({})
        const store = usePlaylistsStore()
        store.clearUserPlaylist()
        return res
      } catch (err) {
        showToast('登出失败')
      } finally {
        this.isLogouting = false
      }
    }
  }
})

export default useAuthStore

import { storeToRefs } from 'pinia'
import useAuthStore from '@/store/auth'

export function useAuth() {
  const store = useAuthStore()
  const { account, profile } = storeToRefs(store)

  const toggleLoginBox = (val: boolean) => {
    store.loginVisible = val
  }

  return {
    account,
    profile,
    toggleLoginBox
  }
}

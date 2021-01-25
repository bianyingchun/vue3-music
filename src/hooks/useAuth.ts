import { computed } from 'vue'
import { Store } from 'vuex'
import { GlobalState } from '@/types'
import { SET_LOGIN_VISIBLE } from '@/store/action-types'

export function useAuth(store: Store<GlobalState>) {
  const account = computed(() => store.state.auth.account)
  const profile = computed(() => store.state.auth.profile)
  const toggleLoginBox = (val: boolean) =>
    store.commit(`auth/${SET_LOGIN_VISIBLE}`, val)

  return {
    account,
    profile,
    toggleLoginBox
  }
}

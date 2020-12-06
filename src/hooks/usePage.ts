import { ref, computed } from 'vue'
const LIMIT = 50
export function usePage(fn: Function) {
  const hasMore = ref(true)
  const loading = ref(false)
  const page = ref(1)
  const offset = computed(() => (page.value - 1) * LIMIT)
  async function getList() {
    if (!hasMore.value || loading.value) return
    loading.value = true
    hasMore.value = await fn(LIMIT, offset.value)
    loading.value = false
    page.value += 1
  }
  return {
    getList,
    loading,
    hasMore
  }
}

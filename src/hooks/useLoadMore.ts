import { throttle } from 'lodash'
import { Ref, onMounted, onUnmounted } from 'vue'
export function useLoadMore(
  refreshElm: Ref<null | HTMLElement>,
  loadData: () => any
) {
  let element: HTMLElement
  const _loadMore = throttle(() => {
    const containerHeight = element.clientHeight
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight
    if (containerHeight + scrollTop + 20 >= scrollHeight) {
      loadData()
    }
  }, 200)

  onMounted(() => {
    element = refreshElm.value as HTMLElement
    element.addEventListener('scroll', _loadMore)
  })
  onUnmounted(() => {
    element.removeEventListener('scroll', _loadMore)
  })
  return {}
}

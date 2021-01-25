import { ref } from 'vue'
interface NavItem {
  name: string
  [prop: string]: any
}
export function useNavSwiper(list: NavItem[], initIndex = 0) {
  const navIndex = ref(initIndex)
  const navList = ref(list)
  const swiper = ref<any>(null)
  function onSlideChange(swiper: any) {
    navIndex.value = swiper.activeIndex
  }
  function onToggleTab(index: number) {
    navIndex.value = index
    ;(swiper.value as any).slideTo(index, 0, false)
  }
  function setControlledSwiper(item: any) {
    swiper.value = item
  }
  return {
    navList,
    navIndex,
    onSlideChange,
    onToggleTab,
    setControlledSwiper
  }
}

import { reactive, createApp, h, computed } from 'vue'
import useSystemStore from '@/store/system'
import ToastComp from './index.vue'
let toastVm: any = null
let toastWraperTimer: any = null
let toastContentTimer: any = null
// const ToastSymbol = Symbol() // 用Symbol创建一个唯一标识，多个插件之间不会冲突
const state = reactive({
  showWrap: false,
  showContent: false,
  text: ''
})

export function showToast(text: string, duration = 4 * 1000) {
  state.showContent = true
  state.showWrap = true
  state.text = text
  if (toastVm === null) {
    toastVm = createApp({
      setup() {
        const store = useSystemStore()
        const theme = computed(() => store.theme.current)
        return () =>
          h(ToastComp, {
            showContent: state.showContent,
            showWrap: state.showWrap,
            text: state.text,
            theme: theme.value
          })
      }
    })
    const el = document.createElement('div')
    document.body.appendChild(el)
    toastVm.mount(el)
  }
  if (toastWraperTimer) clearTimeout(toastWraperTimer)
  if (toastContentTimer) clearTimeout(toastContentTimer)
  toastWraperTimer = setTimeout(() => {
    state.showWrap = false
  }, duration)
  toastContentTimer = setTimeout(() => {
    state.showContent = false
  }, duration - 1250)
} // 插件的主体方法

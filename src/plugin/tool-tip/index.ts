import { reactive, createApp, h, App } from 'vue'
import Comp from './index.vue'
export interface TipItem {
  title: string
  action: Function
}
let toolTipsVm: App | null = null

// const ToastSymbol = Symbol() // 用Symbol创建一个唯一标识，多个插件之间不会冲突
const state = reactive({
  list: [] as TipItem[],
  show: false
})
function hide() {
  state.show = false
}
export function showToolTips(list: TipItem[] = []) {
  state.list = list
  state.show = true
  if (toolTipsVm === null) {
    toolTipsVm = createApp({
      setup() {
        return () =>
          h(Comp, {
            list: state.list,
            show: state.show,
            hide
          })
      }
    })
    const el = document.createElement('div')
    document.body.appendChild(el)
    toolTipsVm.mount(el)
  }
} // 插件的主体方法

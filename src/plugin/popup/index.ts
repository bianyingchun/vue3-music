import { reactive, createApp, App, h } from 'vue'
import Comp from './index.vue'

const state = reactive({
  show: false,
  text: ''
})

function hide() {
  state.show = false
}

export function popup(text = '') {
  return new Promise<void>(resolve => {
    state.text = text
    state.show = true
    function onCancel() {
      //   reject()
      hide()
    }
    function onEnsure() {
      resolve()
      hide()
    }
    const popupInstance = createApp({
      setup() {
        return () =>
          h(Comp, {
            show: state.show,
            text: state.text,
            hide,
            onCancel,
            onEnsure
          })
      }
    })
    const el = document.createElement('div')
    document.body.appendChild(el)
    popupInstance.mount(el)
  })
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$popup = popup
    app.provide('popup', popup)
  }
}

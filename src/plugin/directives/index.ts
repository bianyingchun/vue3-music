import { App } from 'vue'

export default {
  install(app: App) {
    app.directive('longpress', {
      mounted(el, binding) {
        let timer: any = null
        function onTouchStart() {
          if (!timer) {
            timer = setTimeout(() => {
              binding.value()
            }, 2000)
          }
        }
        function onTouchEnd() {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
        }
        el.addEventListener('touchstart', onTouchStart)
        el.addEventListener('touchend', onTouchEnd)
      }
    })
  }
}

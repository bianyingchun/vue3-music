import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/common/scss/app.scss'
import '@/assets/fonts/iconfont.css'
import Loading from '@/components/common/loading.vue'
import Page from '@/components/common/page.vue'
import directives from '@/plugin/directives'
const app = createApp(App)
// 公共组件
app.component('m-loading', Loading)
app.component('m-page', Page)

//自定义指令

app
  .use(directives)
  .use(store)
  .use(router)
  .mount('#app')

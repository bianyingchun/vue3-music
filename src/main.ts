import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import 'swiper/components/pagination/pagination.scss'
import 'swiper/components/scrollbar/scrollbar.scss'
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

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/taste',
    name: 'recommend-taste',
    component: () => import('../views/recommend-taste/index.vue')
  },
  {
    path: '/toplist',
    name: 'toplist',
    component: () => import('../views/toplist/index.vue')
  },
  {
    path: '/playlist/square',
    name: 'playlist',
    component: () => import('../views/playlist-square/index.vue')
  },
  {
    path: '/playlist/:id',
    name: 'playlist-detail',
    component: () => import('../views/playlist/index.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/playlist/tags',
    name: 'playlist-tags',
    component: () => import('../views/playlist-square/tags.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/comment/:type/:id',
    name: 'comment',
    component: () => import('../views/comment/index.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/user/index.vue')
  },
  {
    path: '/user/:id/followeds',
    name: 'user-followeds',
    component: () => import('../views/user-followeds/index.vue')
  },
  {
    path: '/user/:id/follows',
    name: 'user-follows',
    component: () => import('../views/user-follows/index.vue')
  },
  {
    path: '/artists',
    name: 'artists',
    component: () => import('../views/artist-list/index.vue')
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: () => import('../views/artist/index.vue')
  },
  {
    path: '/artist/:id/music',
    name: 'artist-music',
    component: () => import('../views/artist-music/index.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue')
  },
  {
    path: '/song/:id/similar',
    name: 'song-similar',
    component: () => import('../views/song-similar/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router

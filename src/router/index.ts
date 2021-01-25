import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/home/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/mine',
        name: 'mine',
        component: () => import('../views/mine/index.vue')
      },
      {
        path: '/discovery',
        name: 'discovery',
        component: () => import('../views/discovery/index.vue')
      }
    ]
  },
  {
    path: '/discovery/recommend/taste',
    name: 'recommend-taste',
    component: () => import('../views/discovery/recommend-taste.vue')
  },
  {
    path: '/discovery/toplist',
    name: 'toplist',
    component: () => import('../views/discovery/toplist.vue')
  },
  {
    path: '/discovery/playlist',
    name: 'playlist',
    component: () => import('../views/discovery/playlist.vue')
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
    component: () => import('../views/playlist/tags.vue')
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
    component: () => import('../views/user/followeds.vue')
  },
  {
    path: '/user/:id/follows',
    name: 'user-follows',
    component: () => import('../views/user/follows.vue')
  },
  {
    path: '/artists',
    name: 'artists',
    component: () => import('../views/artist/list.vue')
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: () => import('../views/artist/index.vue')
  },
  {
    path: '/artist/:id/music',
    name: 'artist-music',
    component: () => import('../views/artist/music.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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

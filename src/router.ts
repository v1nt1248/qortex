import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Singers from '@/pages/Singers.vue'
import Albums from '@/pages/Albums.vue'
import Songs from '@/pages/Songs.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/singers' },
  { path: '/index.html', redirect: '/singers' },
  {
    path: '/singers',
    component: Singers,
  },
  {
    path: '/singers/:singerId',
    component: Albums,
  },
  {
    path: '/singers/:singerId/:albumId',
    component: Songs,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

/*
 * @Author: your name
 * @Date: 2021-02-19 20:04:34
 * @LastEditTime: 2021-09-07 21:33:59
 * @LastEditors: Edy
 * @Description: In User Settings Edit
 * @FilePath: /online-exam/src/router/index.js
 */
import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      component: () => import('@/views/home/index')
    }]
  },
  {
    path: '/mine',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/mine/index')
    }]
  }
]

const createRouter = () => new Router({
  routes: constantRoutes
})

const router = createRouter()

// reset router
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router

/*
 * @Author: your name
 * @Date: 2021-02-19 20:04:34
 * @LastEditTime: 2021-03-09 15:52:31
 * @LastEditors: Please set LastEditors
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
      component: () => import('@/views/exam-list/exam-index')
    }]
  },
  {
    path: '/mine',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/mine/index')
    }]
  },
  {
    path: '/exam-papers',
    component: () => import('@/views/exam-paper-list/paper-list')
  },
  // 在线考试作答页面
  {
    path: '/exam-paper-ques',
    component: () => import('@/views/exam-paper-ques/ques-online')
  },
  // 试题解析
  {
    path: '/exam-paper-ques-analysis',
    component: () => import('@/views/exam-paper-ques/ques-analysis')
  },
  // 录入答案
  {
    path: '/exam-paper-ques-entry',
    component: () => import('@/views/exam-paper-ques/ques-entry')
  },
  // 答案图片补录页面
  {
    path: '/exam-paper-addimg',
    component: () => import('@/views/exam-paper-addimg/add-ques-img')
  },
  // 成绩分析
  {
    path: '/exam-analysis',
    component: () => import('@/views/exam-analysis/tab'),
    children: [
      // 我的成绩
      {
        path: 'my-score',
        component: () => import('@/views/exam-analysis/my-score')
      },
      // 试题分析
      {
        path: 'ques-analysis',
        component: () => import('@/views/exam-analysis/ques-analysis')
      },
      // 知识点分析
      {
        path: 'knowledge-analysis',
        component: () => import('@/views/exam-analysis/knowledge-analysis')
      },
      // 提升计划
      {
        path: 'improvement-plan',
        component: () => import('@/views/exam-analysis/improvement-plan')
      }
    ]
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

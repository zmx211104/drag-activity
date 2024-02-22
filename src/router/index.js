import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home'),
    },{
    path: '/driveIndex',
    name: 'driveIndex',
    component: () => import('@/views/activity/driveIndex.vue'),
    meta: {
      title: '拉新首页'
    }
  },
]

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
})

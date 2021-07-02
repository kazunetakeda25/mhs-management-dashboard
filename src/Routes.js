import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout/Layout'
import Typography from '@/pages/Typography/Typography'
import Dashboard from '@/pages/Visits/Visits'
import Login from '@/pages/Login/Login'
import ErrorPage from '@/pages/Error/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'account',
          name: 'Account',
          component: Typography
        },
      ]
    },
    {
      path: '*',
      name: 'Error',
      component: ErrorPage
    }
  ]
})

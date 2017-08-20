import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Member from '@/components/pages/Member'
import Manager from '@/components/pages/Manager'
import StorePackage from '@/components/pages/StorePackage'
import Store from '@/components/pages/Store'
import Basic from '@/components/pages/Basic'
import Ad from '@/components/pages/Ad'
import Designer from '@/components/pages/Designer'
import DesignerBasic from '@/components/pages/DesignerBasic'
import ServicePrice from '@/components/pages/ServicePrice'
import Schedule from '@/components/pages/Schedule'
import Permission from '@/components/pages/Permission'
import Order from '@/components/pages/Order'
import Work from '@/components/pages/Work'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/pages/Dashboard'
import VuexStore from '@/store'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/manager',
          name: 'Manager',
          component: Manager
        },
        {
          path: '/package',
          name: 'StorePackage',
          component: StorePackage
        },
        {
          path: '/basic',
          name: 'Basic',
          component: Basic
        },
        {
          path: '/service',
          name: 'ServicePrice',
          component: ServicePrice
        },
        {
          path: '/schedule',
          name: 'Schedule',
          component: Schedule
        },

        {
          path: '/store',
          name: 'Store',
          component: Store
        },
        {
          path: '/member',
          name: 'Member',
          component: Member
        },
        {
          path: '/work',
          name: 'Work',
          component: Work
        },
        {
          path: '/ad',
          name: 'Ad',
          component: Ad
        },
        {
          path: '/designer',
          name: 'Designer',
          component: Designer
        },
        {
          path: '/designer/basic',
          name: 'DesignerBasic',
          component: DesignerBasic
        },
        {
          path: '/permission',
          name: 'Permission',
          component: Permission
        },
        {
          path: '/order',
          name: 'Order',
          component: Order
        },
      ]
    },

  ]
})

router.beforeEach(async (to, from, next) => {
  VuexStore.commit('GET_LOGIN_INFO')
  if(!VuexStore.state.isLogin) {
      var info = VuexStore.state.loginInfo
      console.log(info)
      if(info) {
        await VuexStore.dispatch('onCheckLogin', {username: info.acc, loginType: info.type})
      }
  }
  
  if(to.name === 'Login' || VuexStore.state.isLogin) {
      next()
  }else {
      next({name: 'Login'})
  }
  
})

export default router

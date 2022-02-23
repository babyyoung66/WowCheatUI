import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/views/HelloWorld'
import home_v1 from '@/views/home_v1'
import home_v2 from '@/views/home_v2.vue'
import login from '@/views/login.vue'
import Register from '@/views/Register.vue'
import cheat from '@/views/Cheat.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/cheat',
      name: 'cheat',
      component: cheat,
      
    },
    {
      path: '/',
      name: 'cheat',
      component: cheat,
      
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/home_v1',
      name: 'home_v1',
      component: home_v1,
      
    },
    {
      path: '/home_v2',
      name: 'home_v2',
      component: home_v1,
      
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/Register',
      name:'Register',
      component:Register
    }
  ]
})

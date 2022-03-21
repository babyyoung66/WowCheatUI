import Vue from 'vue'
import Router from 'vue-router'
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

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// bootstrap图标库
import "bootstrap-icons/font/bootstrap-icons.css"


Vue.use(ElementUI)
Vue.config.productionTip = false

/*
封装请求方法,供全局调用
 */

import Api from "./utils/Api"
Vue.prototype.Api = Api

import myutils from './utils/utils'
Vue.prototype.myutils = myutils

// 可以拷贝js文件分模块引入
// import emoji from 'node-emoji'
// Vue.prototype.emoji = emoji


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App

  },
  created() {
  
    let currentUser = JSON.parse(localStorage.getItem("currentUser"))
    let isInit = JSON.parse(sessionStorage.getItem("isInit"))
    if (currentUser != null) {
      if (isInit != null && isInit == true) {
        if (this.$route.name != '' && this.$route.name != 'cheat') {
          this.$router.replace("/cheat");
          ElementUI.Message.success({
            message: '已自动登录，如需取消请重新登录，并取消记住登录选项！',
            duration: 4500
          });
        }
        return
      }
      this.$store.commit('DATA_INIT', currentUser)
      if (this.$route.name != '' && this.$route.name != 'cheat') {
        this.$router.replace("/cheat");
      }
      ElementUI.Message.success({
        message: '已自动登录，如需取消请重新登录，并取消记住登录选项！',
        duration: 6500
      });

    } 
    if(currentUser == null && !isInit) {
      if (this.$route.name != 'login') {
        ElementUI.Message.error({ message: '尚未登录，请登录!' });
        this.$router.replace("/login");//跳转到登陆页
      }
    }

  },
  mounted() {
    // let Ping = setInterval({},10000)
  },
  template: '<App/>',

})

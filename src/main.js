// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// bootstrap图标库
import "bootstrap-icons/font/bootstrap-icons.css"


Vue.use(ElementUI)


Vue.config.productionTip = false

/*
封装请求方法,供全局调用
 */ 
import {postRequest} from "./api/Api"
import {getRequest} from "./api/Api"
import {putRequest} from "./api/Api"
import {deleteRequest} from "./api/Api"
import {logoutRequest} from "./api/Api"
import {CreateQRCode} from "./api/Api"

Vue.prototype.postRequest=postRequest
Vue.prototype.getRequest=getRequest
Vue.prototype.putRequest=putRequest
Vue.prototype.deleteRequest=deleteRequest
Vue.prototype.logoutRequest=logoutRequest
Vue.prototype.CreateQRCode=CreateQRCode

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { 
    App 
  
  },
  template: '<App/>',
  
})

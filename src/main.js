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
import { mapGetters, mapState } from 'vuex' 
Vue.prototype.mapGetters = mapGetters
Vue.prototype.mapState = mapState

Vue.use(ElementUI)
Vue.config.productionTip = false

/*
封装请求方法,供全局调用
 */ 

import {postRequest} from "./utils/Api"
import {getRequest} from "./utils/Api"
import {putRequest} from "./utils/Api"
import {deleteRequest} from "./utils/Api"
import {logoutRequest} from "./utils/Api"
import {CreateQRCode} from "./utils/Api"


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
  store,
  components: { 
    App 
  
  },
  template: '<App/>',
  
})

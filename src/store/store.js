import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import common from './modules/common'
import list from './modules/list'

Vue.use(Vuex)

const store = new Vuex.Store({

    modules: {
        common,
        list
    },

    //更新state对象数据的方法
    mutations: {
        saveState(state) {
            this.commit('common/saveState', {}, { root: true })
            this.commit('list/saveState', {}, { root: true })
        },
        removeState(state){
            this.commit('common/removeState', {}, { root: true })
            //this.commit('list/removeState', {}, { root: true })
        }

    },

})
export default store;
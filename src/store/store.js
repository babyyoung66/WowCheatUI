import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import common from './modules/common'
import list from './modules/list'
import message from './modules/message'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        common,
        list,
        message
    },

    //更新state对象数据的方法
    mutations: {
        // 初始化数据
        DATA_INIT(state, data) {
            this.commit('list/INIT', data)
            this.commit('message/INIT_Message', data)
        },
        saveState(state) {
            this.commit('list/saveState')
            this.commit('message/saveState')
        },
        removeState(state) {
            this.commit('list/removeState', {}, { root: true })
            localStorage.removeItem("currentUser")
            sessionStorage.clear()
        }

    },
    getters:{
        getInitStatus(state){
            //取异或值，等于0则全部初始化，等于1则未初始化完成
            return state['list'].isInit^state['message'].isInit
        }
    },
    actions: {
        async initList({ commit }, data) {
            console.log(data)
            commit('list/INIT', data)
        },
        async initMessage({ dispatch, commit, state }, currentUser) {
            await dispatch('initList', currentUser)
            commit('message/INIT_Message', state['list'].talkList)
        }
    }

})
export default store;
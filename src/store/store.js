import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import common from './modules/common'
import message from './modules/message'
import stompSocket from './modules/stompSocket'


Vue.use(Vuex)


const store = new Vuex.Store({

    modules: {
        common,
        message,
        stompSocket
    },

    //更新state对象数据的方法
    mutations: {
        // 初始化数据
        DATA_INIT(state, cur_user) {
            sessionStorage.setItem("uuid", cur_user.user.uuid)
            sessionStorage.setItem("currentUser", JSON.stringify(cur_user))
            store.commit('common/INIT', cur_user)
            store.commit('message/INIT', cur_user);
            store.commit('stompSocket/INIT_SOCKET');
            sessionStorage.setItem("isInit", "true")

        },
        saveState(state) {
            this.commit('common/saveState')
            this.commit('message/saveState')
        },
        removeState(state) {
            this.commit('common/removeState', {}, { root: true })
            this.commit('message/removeState', {}, { root: true })
            this.commit('stompSocket/removeState', {}, { root: true })
            localStorage.removeItem("currentUser")
            sessionStorage.clear()

        }

    },
    getters: {
        getInitStatus(state) {
            //取异或值，等于0则全部初始化，等于1则未初始化完成
            return (state['common'].isInit ^ state['message'].isInit) == 0
        }
    },
    actions: {

    }

})

export default store;
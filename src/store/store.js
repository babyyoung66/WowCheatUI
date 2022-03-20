import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import common from './modules/common'
import message from './modules/message'

Vue.use(Vuex)


const store = new Vuex.Store({
 
    modules: {
        common,
        message
    },

    //更新state对象数据的方法
    mutations: {
        // 初始化数据
        DATA_INIT(state, data) { 
            this.commit('common/INIT', data)
            this.commit('message/INIT_Message', data)
            
        },
        saveState(state) {
            this.commit('common/saveState')
            this.commit('message/saveState')
        },
        removeState(state) {     
            this.commit('common/removeState', {}, { root: true })
            this.commit('message/removeState', {}, { root: true })
            localStorage.removeItem("currentUser")
            sessionStorage.clear()
            
        }

    },
    getters:{
        getInitStatus(state){
            //取异或值，等于0则全部初始化，等于1则未初始化完成
            return state['common'].isInit^state['message'].isInit
        }
    },
    actions: {
        async initList({ commit }, data) {
            console.log(data)
            commit('common/INIT', data)
        },
        async initMessage({ dispatch, commit, state }, currentUser) {
            await dispatch('initList', currentUser)
            commit('message/INIT_Message', state['common'].talkList)
        }
    }

})
export default store;
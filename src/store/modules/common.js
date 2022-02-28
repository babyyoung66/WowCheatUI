// 公共数据、状态模块
//从localstorage获取数据，没有则初始化
const uuid = sessionStorage.getItem("uuid")
const key = 'common_' + uuid
const state = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {
    //当前登录用户信息
    currentUser: {},
    token: "",
    //当前打开的列表
    ListType: "message",
    //当前打开的对话对象
    currentCheatObj: {}

}

//更新state对象数据的方法
const mutations = {
    //state默认参数
    saveState(state) {
        console.log("common数据已持久化!")
        //未打开消息或通讯录列表时，清空currentCheatObj再保存
        let open = state.ListType
        if(open == "message" || open == "friend"){
                   
        }else{
            state.currentCheatObj = {}
        }
        localStorage.setItem(key, JSON.stringify(state) )
    },
    removeState(state){
        
        localStorage.removeItem(key)
    },

    setUserinfo(state, data) {
        state.currentUser = data.user
        state.token = data.token
    },
    setToken(state, token) {
        state.token = token
    },
    setListType(state, type) {
        state.ListType = type
    },
    setCurrentCheatObj(state, user) {
        state.currentCheatObj = user
    }

}

//提交的是 mutation,即将mutations的方法异步执行
const actions = {
    saveState(context) {
        context.commit('saveState')
    },

}

//相当于vue的computed，计算过滤返回数据
const getters = {
   get(state){
       console.log("common")
   }
}


export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
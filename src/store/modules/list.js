const uuid = sessionStorage.getItem("uuid")
const key = 'list_' + uuid
const state = localStorage.getItem(key) != null ? JSON.parse(localStorage.getItem(key)) : {
    //消息列表
    messageList: [],
    //好友列表
    FriendsList: [],
    //缓存（无数据时使用上一个列表）
    cache:""


}

//更新state对象数据的方法
const mutations = {
    //state默认参数
    saveState(state) {
        console.log("list数据已持久化!")
        
        localStorage.setItem(key, JSON.stringify(state))
    },
    removeState(state) {
        state = {}
        localStorage.removeItem(key)
    },

    setMessageList(state, list) {
        state.messageList = list
    },
    setFriendsList(state, list) {
        state.FriendsList = list
    },
    setCache(state,type){
        state.cache = type
    }

}

//提交的是 mutation,即将mutations的方法异步执行
const actions = {

}

//相当于vue的computed，计算过滤返回数据
const getters = {
    getListByType: (state) => (type) => {
        // console.log(type)
        if (type == 'message') {
            return state.messageList
        } else if (type == 'friend') {
            return state.FriendsList
        }
    },
    getQueryData: (state) => {
        //浅拷贝合并两个数组,用于搜索
        if (state.messageList != null && state.FriendsList != null) {
            return state.messageList.concat(state.FriendsList)
        } else {
            return state.messageList != null ? state.messageList : state.FriendsList
        }
    },
    getSelectedIndex:(state)=>{
        let current = this.$store.state['common'].currentCheatObj
        if(current != null){
          let arr =  this.getListByType(state.cache)
          arr.array.forEach(element => {
              console.log(element)
          });
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
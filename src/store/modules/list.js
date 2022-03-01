//定时器获取uuid，确保已经获取到
let usr = JSON.parse(localStorage.getItem("currentUser"))
if (usr != null) {
    var uuid = usr.user.uuid
} else {
    uuid = "default"
    console.log("取默认uuid")
}
var key = 'list_' + uuid
const state = localStorage.getItem(key) != null ? JSON.parse(localStorage.getItem(key)) : {
    //当前打开的列表
    ListType: "message",
    //当前打开的对话对象
    currentCheatObj: {},
    //消息列表
    messageList: [],
    //好友列表
    FriendsList: [],
    //缓存（无数据时使用上一个列表）
    cache: ""


}

//更新state对象数据的方法
const mutations = {
    //state默认参数
    saveState(state) {
        console.log("list数据已持久化!")
        //未打开消息或通讯录列表时，清空currentCheatObj再保存
        uuid = sessionStorage.getItem("uuid")
        key = 'list_' + uuid
        let open = state.ListType
        if (open == "message" || open == "friend") {

        } else {
            state.currentCheatObj = {}
        }
        localStorage.setItem(key, JSON.stringify(state))
    },
    removeState(state) {
        uuid = sessionStorage.getItem("uuid")
        key = 'list_' + uuid
        state = {}
        localStorage.removeItem(key)
    },

    setMessageList(state, list) {
        state.messageList = list
    },

    setFriendsList(state, list) {
        state.FriendsList = list
    },

    setCache(state, type) {
        state.cache = type
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
    getSelectedIndex: (state) => {
        let current = this.$store.state['common'].currentCheatObj
        if (current != null) {
            let arr = this.getListByType(state.cache)
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
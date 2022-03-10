import Vue from 'vue'
import Api from "@/utils/Api"

let usr = JSON.parse(localStorage.getItem("currentUser"))
if (usr != null) {
    var uuid = usr.user.uuid
}
var key = 'list_' + uuid
const state = sessionStorage.getItem(key) != null ? JSON.parse(sessionStorage.getItem(key)) : {
    isInit:false,
    //当前打开的列表 "talkList" || "friend" 后续可以维护成全局静态参数
    ListType: "",
    //当前打开的对话对象
    currentCheatObj: { "name": "系统公告" },
    //当前查看的好友信息
    checkDetial: null,
    //消息列表
    talkList: [],
    //好友列表
    FriendsMap: {},
    //缓存（无数据时使用上一个列表）
    cache: "",
    messageFormType: "group"

}

//更新state对象数据的方法
const mutations = {
    //初始化数据
    INIT(state, data) {

        // 初始化好友列表
        let isInit = JSON.parse(sessionStorage.getItem("isInit"))
        if (state.isInit == false) {
            sessionStorage.setItem("uuid", data.user.uuid)
            localStorage.setItem("currentUser", JSON.stringify(data))
            Vue.set(state.FriendsMap, data.user.uuid, data.user)
            Api.postRequest('/friend/getList').then(res => {
                if (res.data.success) {
                    let list = res.data.data
                    list.forEach(element => {
                        Vue.set(state.FriendsMap, element.uuid, element)
                    });
                }
                //初始化消息列表
                let idkey = 'talkId_' + data.user.uuid
                let talk = localStorage.getItem(idkey) != null ? JSON.parse(localStorage.getItem(idkey)) : null
                if (talk != null) {
                    talk.forEach(id => {
                        let usr = state.FriendsMap[id]
                        if (usr != null) {
                            state.talkList.push(usr)
                        }
                    });

                }                
                //初始化消息
                //commit('message/INIT_Message', {}, { root: true })
                //dispatch('INIT_Message',state,commit)
            });
            sessionStorage.setItem("isInit", true)
            state.isInit = true
        } else {
            console.log("已初始化")
        }

    },

    //state默认参数
    saveState(state) {
        //未打开消息或通讯录列表时，清空currentCheatObj再保存
        uuid = sessionStorage.getItem("uuid")
        key = 'list_' + uuid
        let open = state.ListType
        if (open == "talkList" || open == "friend") {

        } else {
            state.currentCheatObj = {}
        }
        sessionStorage.setItem(key, JSON.stringify(state))
        //保存消息列表的好友uuid
        var talkId = []
        state.talkList.forEach(element => {
            talkId.push(element.uuid)
        });
        let idkey = 'talkId_' + uuid
        localStorage.setItem(idkey, JSON.stringify(talkId))
    },
    // 初始化
    removeState(state) {
        state.currentCheatObj = {}
        state.FriendsMap = {}
        state.ListType = ""
        state.talkList = []
        state.cache = "",
        state.messageFormType = "group"
    },
    // 存成key-value格式，uuid为key
    setFriendsMap(state, list) {
        list.forEach(element => {
            Vue.set(state.FriendsMap, element.uuid, element)
        });
    },
    setCache(state, type) {
        state.cache = type
    },

    setListType(state, type) {
        state.ListType = type
    },

    setCurrentCheatObj(state, user) {
        state.currentCheatObj = user
    },

    setmessageFormType(state, type) {
        state.messageFormType = type
    },
    setCheckDetial(state, object) {
        state.checkDetial = object
    }


}

//提交的是 mutation,即将mutations的方法异步执行
const actions = {
    INIT_Message({ state,
        commit,
        dispatch,
        rootState, }) {
        commit('message/INIT_Message', state.talkList, { root: true })
    }
}

//相当于vue的computed，计算过滤返回数据
const getters = {
    getListType: (state) => {
        return state.ListType === '' ? 'talkList' : state.ListType
    },
    getListByType: (state) => (type) => {
        // console.log(type)
        if (type == 'talkList') {
            return state.talkList
        } else if (type == 'friend') {
            if (state.FriendsMap != null) {
                let data = []
                let object = state.FriendsMap
                for (const key in object) {
                    data.push(object[key])
                }
                return data
            }
        }
    },
    getQueryData: (state) => {
        //将FriendMap转回数组
        if (state.FriendsMap != null) {
            let data = []
            let object = state.FriendsMap
            for (const key in object) {
                data.push(object[key])
            }
            return data
        }
    },
    getUserByuuid:(state)=>(uid)=>{
        if (state.FriendsMap != null) {
          return  state.FriendsMap[uid] != null ? state.FriendsMap[uid] : null
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
import Vue from 'vue'
import Api from "@/utils/Api"

let usr = JSON.parse(localStorage.getItem("currentUser"))
if (usr != null) {
    var uuid = usr.user.uuid
}
var key = 'common_' + uuid
const state = sessionStorage.getItem(key) != null ? JSON.parse(sessionStorage.getItem(key)) : {
    isInit: false,
    currentUser:{},
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
    //群聊列表
    GroupsMap: {},
    //消息框类型(personal/group)
    messageFormType: "",
    //默认发送消息格式
    defaultMess:{"from":'',"to":'',"content":'',"msgType":'',"time":''},
    //文件消息详细
    fileDetail:{"fileUrl":'',"fileName":'',"fileType":''}

}

//更新state对象数据的方法
const mutations = {
    //初始化数据
    INIT(state, data) {

        // 初始化好友列表
        if (state.isInit == false) {
            sessionStorage.setItem("uuid", data.user.uuid)
            localStorage.setItem("currentUser", JSON.stringify(data))
            state.currentUser = data.user
            //同时存入自己的信息
            Vue.set(data.user, 'type', 'personal')
            Vue.set(state.FriendsMap, data.user.uuid, data.user)
            //获取好友列表
            Api.postRequest('/friend/getList').then(res => {
                if (res.data.success) {
                    let list = res.data.data
                    list.forEach(element => {
                        Vue.set(element, 'type', 'personal')
                        Vue.set(state.FriendsMap, element.uuid, element)
                    });
                }

                //获取群聊列表 待添加
                /*  Api.postRequest('/group/getList').then(res => {
                     if (res.data.success) {
                         let list = res.data.data
                         list.forEach(element => {
                             Vue.set(element, 'type', 'group')
                             Vue.set(state.GroupsMap, element.uuid, element)
                         });
                     }
                     //添加后将消息初始化放至该位置
 
                 })
  */

                //初始化消息列表
                let idkey = 'talkId_' + data.user.uuid
                let talk = localStorage.getItem(idkey) != null ? JSON.parse(localStorage.getItem(idkey)) : null
                if (talk != null) {
                    talk.forEach(id => {
                        let usr = state.FriendsMap[id] //浅拷贝，影响原数据
                        if (usr != null) {
                            state.talkList.push(usr)
                        }
                    });

                }
            });
            state.isInit = true
        }

    },

    //state默认参数
    saveState(state) {
        //未打开消息或通讯录列表时，清空currentCheatObj再保存
        uuid = sessionStorage.getItem("uuid")
        key = 'common_' + uuid
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
        state.isInit = false
        state.currentCheatObj = {}
        state.FriendsMap = {}
        state.ListType = ""
        state.talkList = []
        state.cache = "",
        state.messageFormType = ""
    },
    // 存成key-value格式，uuid为key
    setFriendsMap(state, list) {
        list.forEach(element => {
            Vue.set(state.FriendsMap, element.uuid, element)
        });
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
    },
    //将用户置顶到聊天列表
    setUserOnTopOfTalkList(state, user) {
        let i = 0
        if (state.talkList != null && state.talkList.length > 0) {
            state.talkList.forEach(element => {
                //列表已存在该用户时，则先删除
                if (element.uuid === user.uuid) {
                    state.talkList.splice(i, 1)     
                    return
                }
                i++
            });
        }
        state.talkList.unshift(user)
        
    },
    //更新好友或群聊联系时间
    upDateConcatTime(state){
        if(state.currentCheatObj.uuid == '' || state.currentCheatObj.uuid == null || state.currentCheatObj.uuid == undefined){
            return
        }
        if(state.currentCheatObj.concatInfo.unReadTotal <= 0){
            //未读已清0，不重复请求
            return
        }
        if(state.messageFormType == 'personal'){
            //个人
            state.currentCheatObj.concatInfo.unReadTotal = 0  //未读清0
            Api.postByXWForm('/friend/UpdateConcatTime',{"uuid":state.currentCheatObj.uuid})

        }else if(state.messageFormType == 'group'){
            //群聊
            state.currentCheatObj.concatInfo.unReadTotal = 0  //未读清0
            Api.postByXWForm('/group/UpdateConcatTime',{"uuid":state.currentCheatObj.uuid})
        }
    }


}

//提交的是 mutation,即将mutations的方法异步执行
const actions = {

}

//相当于vue的computed，计算过滤返回数据
const getters = {
    getListType: (state) => {
        return state.ListType === '' ? 'notice' : state.ListType
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
    //整合搜索需要的数据
    getQueryData: (state) => {
        //转回数组
        let data = []
        if (state.FriendsMap != null) {
            let object = state.FriendsMap
            for (const key in object) {
                data.push(object[key])
            }
            
        }

        if (state.GroupsMap != null) {
            let object = state.GroupsMap
            for (const key in object) {
                data.push(object[key])
            }
            
        }

        return data
    },

    getUserByuuid: (state) => (uid) => {
        //朋友
        if (state.FriendsMap != null) {
            var friend = state.FriendsMap[uid] != null ? state.FriendsMap[uid] : null
        }
        //群聊
        if (state.GroupsMap != null) {
            var group =  state.GroupsMap[uid] != null ? state.GroupsMap[uid] : null
        }
        //返回其中一个
        if(group != null || friend != null ){
            
            return friend != null?friend:group
        }      
    },
    getCurrentCheatObj: (state) => {
        return state.ListType == 'notice' ? { "name": "系统公告" } : state.currentCheatObj
    }

}
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
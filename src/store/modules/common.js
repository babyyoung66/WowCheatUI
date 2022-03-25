import Vue from 'vue'
import Api from "@/utils/Api"
var _ = require('lodash');
import TimeUtils from '@/utils/TimeUtils'

let usr = JSON.parse(sessionStorage.getItem("currentUser"))
if (usr != null) {
    var uuid = usr.user.uuid
}
var key = 'common_' + uuid
const state = sessionStorage.getItem(key) != null ? JSON.parse(sessionStorage.getItem(key)) : {
    isInit: false,
    currentUser: {},
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

}

//更新state对象数据的方法
const mutations = {
    //初始化数据
    INIT(state, data) {

        // 初始化好友列表
        if (state.isInit == false) {
            state.currentUser = data
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
                //message组件依赖数据，所以得保证common初始化完成后再初始化message
                this.commit('message/INIT_Message', data)
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
        state.currentUser = {}
        state.GroupsMap = {}
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
    //将用户置顶到聊天列表(设置消息时间戳，已在getters中按时间戳降序排列)
    setUserOnTopOfTalkList(state, user) {
        //使用现有的commit(模拟message类型格式)
        let msg = { "from": user.uuid, "to": user.uuid, "msgType": user.type, "time": '' }
        this.commit('common/setLastMessTime', msg)
    },
    //user={"uuid":,"type":"personal(group)"}
    upDateUnreadTotal(state, user) {
        //是当前聊天对象则不更新
        if (user.uuid == state.currentCheatObj.uuid) {
            return
        }
        console.log(state.FriendsMap[user.uuid])
        if (user.type === 'personal') {
            let usr = state.FriendsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = state.FriendsMap[user.uuid].concatInfo.unReadTotal
                state.FriendsMap[user.uuid].concatInfo.unReadTotal = total + 1
                console.log(state.FriendsMap[user.uuid])
            }
        }

        if (user.type === 'group') {
            let usr = state.GroupsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = state.GroupsMap[user.uuid].concatInfo.unReadTotal
                context.GroupsMap[user.uuid].concatInfo.unReadTotal = total + 1
            }
        }


    },
    setLastMessTime(state, message) {
        let time = TimeUtils.getMillis(message.time)
        if (message.msgType == 'personal') {
            let from = message.from
            if (from == state.currentUser.user.uuid) {
                from = message.to
            }
            Vue.set(state.FriendsMap[from], 'lastMessTime', time)
            //更新talkList
            for (let index = 0; index < state.talkList.length; index++) {
                const element = state.talkList[index];
                if (element.uuid == from) {
                    state.talkList.splice(index, 1)
                    state.talkList.unshift(state.FriendsMap[from])
                    return
                }
            }
        }
        if (message.msgType == 'group') {
            Vue.set(state.GroupsMap[message.to], 'lastMessTime', time)
        }


    },


}

//提交的是 mutation,即将mutations的方法异步执行
const actions = {
    //更新好友或群聊联系时间,更新friendMap数据，而不是talkList
    upDateConcatTime(context, user) {

        let uuid = user.uuid
        //自己则不处理
        if (uuid == context.state.currentUser.user.uuid) {
            return
        }

        if (context.state.FriendsMap[uuid].concatInfo != null && context.state.FriendsMap[uuid].concatInfo.unReadTotal <= 0) {
            //未读已清0，不重复请求
            return
        }
        if (user.type == 'personal') {
            //个人
            context.state.FriendsMap[uuid].concatInfo.unReadTotal = 0  //未读清0
            Api.postByXWForm('/friend/UpdateConcatTime', { "uuid": uuid })

        } else if (user.type == 'group') {
            //群聊，预留，后台未开发
            context.state.FriendsMap[uuid].concatInfo.unReadTotal = 0  //未读清0
            Api.postByXWForm('/group/UpdateConcatTime', { "uuid": uuid })
        }
    },
    //user={"uuid":,"type":"personal(group)"}
    upDateUnreadTotal(context, user) {
        //是当前聊天对象则不更新
        if (user.uuid == context.state.currentCheatObj.uuid) {
            return
        }
        if (user.type == 'personal') {
            let usr = context.state.FriendsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = context.state.FriendsMap[user.uuid].concatInfo.unReadTotal
                context.state.FriendsMap[user.uuid].concatInfo.unReadTotal = total + 1
            }

        }

        if (user.type == 'group') {
            let usr = context.state.GroupsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = context.state.GroupsMap[user.uuid].concatInfo.unReadTotal
                context.state.GroupsMap[user.uuid].concatInfo.unReadTotal = total + 1
            }
        }


    },
    //message类,标记最后消息时间,只用于初始化时排序


}

//相当于vue的computed，计算过滤返回数据
const getters = {
    getListType: (state) => {
        return state.ListType === '' ? 'notice' : state.ListType
    },
    getListByType: (state) => (type) => {

        if (type == 'talkList') {
            state.talkList = _.orderBy(state.talkList, 'lastMessTime', 'desc')
            return state.talkList
            //返回降序内容，按最后一条消息排
            //return _.orderBy(state.talkList,'lastMessTime','desc')
        } else if (type == 'friend') {
            if (state.FriendsMap != null) {
                let data = []
                let object = state.FriendsMap
                for (const key in object) {
                    data.push(object[key])
                }
                //按名字升序排
                return _.orderBy(data, 'name')
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
            var group = state.GroupsMap[uid] != null ? state.GroupsMap[uid] : null
        }
        //返回其中一个
        if (group != null || friend != null) {

            return friend != null ? friend : group
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
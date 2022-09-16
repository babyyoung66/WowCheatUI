import Vue from 'vue'
import Api from "@/utils/Api"
var _ = require('lodash');

let usr = JSON.parse(sessionStorage.getItem("currentUser"))
if (usr != null) {
    var uuid = usr.user.uuid
}
var key = 'message_' + uuid
const state = sessionStorage.getItem(key) != null ? JSON.parse(sessionStorage.getItem(key)) : {
    isInit: false,
    messageMap: {},
    //聊天记录缓冲区,聊天记录分段展示，信息框只展示缓冲区内容，为当前聊天对象的消息
    messageChche: { "uuid": '', message: [] },
    defaultMessage: { "content": "近6个月内没有互动...", "time": "", 'contentType': 'text' },
    //默认发送消息格式
    defaultMess: { "from": '', "to": '', "content": '', "msgType": 'personal', "contentType": "text" },
    //文件消息详细
    fileDetail: { "fileUrl": '', "fileName": '', "fileType": '' }
}

const mutations = {
    INIT(state, data) {
        if (!state.isInit) {
            console.log("初始化消息中...")
            // 获取list的消息列表
            this.commit('message/Init_Local', data)
            //查找包含未读记录的联系人并初始化消息
            this.commit('message/Init_Friend')
            //查找包含未读记录的群聊并初始化消息（预留方法）
            this.commit('message/Init_Group')
            state.isInit = true
            console.log("初始化消息完毕...")
        }
    },

    removeState(state) {
        state.messageMap = {}
        state.isInit = false
    },

    saveState(state) {
        var cur = JSON.parse(sessionStorage.getItem("currentUser"))
        if (cur == null || cur == undefined) {
            return
        }
        var uuid = cur.user.uuid
        var key = 'message_' + uuid
        sessionStorage.setItem(key, JSON.stringify(state))
    },

    Init_Local(state, data) {
        //初始化本地消息列表相关好友的记录
        let talk = this.state['common'].talkList
        if(talk == null || talk.length == 0){
            //为空时尝试从localstorage获取
            let key = 'talkList_' + data.user.uuid
            talk = JSON.parse(localStorage.getItem(key))
        }
        if (talk != null && talk.length > 0) {
            for (let index = 0; index < talk.length; index++) {
                const user = talk[index];
                Api.postRequest('/message/getByPage', { "to": user.uuid, "msgType": user.type }).then(res => {
                    if (res.data.success) {
                        let mss = res.data.data
                        if (mss != null && mss.length > 0) {
                            Vue.set(state.messageMap, user.uuid, mss)
                            //标记最后消息时间
                            let lastmess = mss[mss.length - 1]
                            this.commit('common/setLastMessTime', lastmess)
                        } else {
                            //没有消息时设置默认时间
                            let mess = { "from": user.uuid, "to": user.uuid, "time": '1990-01-01 01:40:43.796', 'msgType': user.type }
                            this.dispatch('common/setLastMessTime', mess)
                        }
                    }else{
                        //初始化错误，从列表移除 
                        this.commit('common/removeFromTalkList', user)
                    }
                })

            }
        }
    },
    //初始化存在未读记录的用户和群聊，并放到talkList
    Init_Friend(state) {
        let friendsMap = this.state['common'].FriendsMap
        if (friendsMap != null) {
            for (const key in friendsMap) {
                const friend = friendsMap[key];
                if (friend.concatInfo != null && friend.concatInfo.unReadTotal > 0) {
                    Api.postRequest('/message/getByPage', { "to": friend.uuid,"msgType":"personal" }).then(res => {
                        if (res.data.success) {
                            let mss = res.data.data
                            if (mss != null) {
                                Vue.set(state.messageMap, friend.uuid, mss)
                                //标记最后消息时间
                                let lastmess = mss[mss.length - 1]
                                this.commit('common/setLastMessTime', lastmess)
                                //加入消息列表,有可能重复，所以使用现有方法
                                // this.state['common'].talkList.push(friend)
                                this.commit('common/setUserOnTopOfTalkList', friend)
                            }

                        }
                    })
                }
            }
        }           
          
    },
    Init_Group(state) {
        let GroupsMap = this.state['common'].GroupsMap
        if (GroupsMap != null) {
            for (const key in GroupsMap) {
                const Group = GroupsMap[key];
                if (Group.concatInfo != null && Group.concatInfo.unReadTotal > 0) {
                    Api.postRequest('/message/getByPage', { "to": Group.uuid ,"msgType":"group" }).then(res => {
                        if (res.data.success) {
                            let mss = res.data.data
                            if (mss != null) {
                                Vue.set(state.messageMap, Group.uuid, mss)
                                //标记最后消息时间
                                let lastmess = mss[mss.length - 1]
                                this.commit('common/setLastMessTime', lastmess)
                                //加入消息列表
                                // this.state['common'].talkList.push(Group)
                                this.commit('common/setUserOnTopOfTalkList', Group)
                            }
                        }
                    })
                }
            }
        }
    },

    //追加单条（新发送的）消息到尾部，并置顶当前对象到聊天列表{ "user": "", "message": "" }
    pushOneMessageByUUID(state, messageData) {   
        if (state.messageMap[messageData.user.uuid] != null) {
            //存在则追加到底部
            state.messageMap[messageData.user.uuid].push(messageData.message)

        } else {
            let messArry = []
            messArry.push(messageData.message)
            Vue.set(state.messageMap, messageData.user.uuid, messArry)
        }
         //当前缓存内容相关
         if(messageData.user.uuid == state.messageChche.uuid){
            let message = state.messageMap[messageData.user.uuid]
            let curSize = state.messageChche.message.length
            let total = message.length
            let start = total - curSize
            //刷新缓存
            state.messageChche.message = _.slice(message, start)
        }
    },
    // 查询或追加历史聊天记录,请求格式 { "user": "", "message": "" }
    pushMessageArryByUUIDOnTop(state, messageData) {
        if (messageData == null || messageData.length == 0) {
            return
        }
        let uid = messageData.user.uuid
        let oldmess = state.messageMap[uid]
        if (oldmess !== null) {
            //存在则追加到底部
            let newarry = messageData.message.concat(oldmess)
            // state.messageMap[messageData[0].from] = newarry
            Vue.set(state.messageMap, uid, newarry)
        } else {
            Vue.set(state.messageMap, uid, messageData.message)
        }
    },
    //初始化用户消息{"to":'',"msgType":'',"time":''},time为空时则默认查询，to及msgType必填
    InitUserMessage(state, user) {
        //是否在talkList中，存在则已初始化
        //如果不在消息列表中则初始化消息
        let talkList = this.state['common'].talkList
        let notIn = true
        talkList.forEach(element => {
            if (element.uuid == user.uuid) {
                notIn = false
                return
            }
        });
        //本地是否已初始化过
        let oldmess = state.messageMap[user.uuid]
        if (notIn && oldmess == null) {
            let message = { "to": user.uuid, "msgType": user.type }
            Api.postRequest('/message/getByPage', message).then(res => {
                if (res.data.success) {
                    let messDta = { "user": user, "message": res.data.data }
                    // 初始化时直接赋值，如果已初始化则使用新增
                    this.dispatch('message/setMessageMapByUUID', messDta)
                }
            })
        }

    },
    //{ "uuid":"", "length": }
    updateMessageCache(state, info) {
        //每次根据刷新的数量递增的方式获取
        let message = state.messageMap[info.uuid]
        if (message == null || typeof(message)  == undefined || message.length == 0) {
            return
        }
        //默认返回20条数据
        if (info.length == 0 && message.length > 20) {
            state.messageChche.message = _.slice(message, message.length - 20)
            return
        }
        //到达顶部或者数据小于20条直接返回
        if (info.length >= message.length || message.length <= 20) {
            state.messageChche.message = message
            return
        }
        state.messageChche.message = _.slice(message, message.length - info.length)
        // if (mess.length > 0) {
        //     state.messageChche.message = mess.concat(state.messageChche.message)
        // }
    },
    deleteMessageById(state,uuid){
        Vue.delete(state.messageMap, uuid)
    },

}

const getters = {
    getlastMessage: (state) => (uid) => {
        if (state.messageMap != null) {
            let msgarry = state.messageMap[uid]
            if (msgarry != null && msgarry.length > 0) {
                return msgarry[msgarry.length - 1]
            }
        }
        return state.defaultMessage
    },
    //返回消息
    getMessagesByuuid: (state) => (uid, length) => {  
        //每次根据刷新的数量递增的方式获取
        let message = state.messageMap[uid]
        if (message == null || message == undefined || message.length == 0) {
            return null
        }
        //默认返回20条数据
        if (length == 0 && message.length > 20) {
            return _.slice(message, message.length - 20)
        }
        //到达顶部或者数据小于20条直接返回
        if (length >= message.length || message.length <= 20) {
            return message
        }
        let mess = _.slice(message, message.length - length)
        return mess.length > 0 ? mess : null
    },
    getCheatMessages: (state) => (uuid) => {
        //消息为空，或切换用户时尝试加载消息
        if(state.messageChche.uuid != uuid || state.messageChche.message.length == 0){
            //初始化
            state.messageChche.uuid = uuid  
            state.messageChche.message = []
            let message = state.messageMap[uuid]
            if (message == null || typeof(message)  == undefined || message.length == 0) {
                return null
            }
            if (message.length > 20) {
                state.messageChche.message = _.slice(message, message.length - 20)
            }else{
                state.messageChche.message = message
            }
        }
        let mess = state.messageChche.message
        if(mess.length > 0){
            return state.messageChche.message
        }
        return null
    },

}

const actions = {
    //异步初始方法，返回promise
    INIT(context, data) {
        //message组件依赖数据，所以得保证common初始化完成后再初始化message
        this.commit('message/INIT', data)
    },

    setMessageMapByUUID(context, messageData) {
        Vue.set(context.state.messageMap, messageData.user.uuid, messageData.message)
    },


}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
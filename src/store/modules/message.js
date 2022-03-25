import Vue from 'vue'
import Api from "@/utils/Api"
let usr = JSON.parse(sessionStorage.getItem("currentUser"))
if (usr != null) {
    var uuid = usr.user.uuid
}
var key = 'message_' + uuid
const state = sessionStorage.getItem(key) != null ? JSON.parse(sessionStorage.getItem(key)) : {
    isInit: false,
    messageMap: {},
    defaultMessage: { "content": "近6个月内没有互动...", "time": "" },
    //默认发送消息格式
    defaultMess: { "from": '', "to": '', "content": '', "msgType": 'personal', "time": '', "contentType": "text" },
    //文件消息详细
    fileDetail: { "fileUrl": '', "fileName": '', "fileType": '' }
}

const mutations = {
    INIT_Message(state, data) {
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
        var uuid = JSON.parse(sessionStorage.getItem("currentUser")).user.uuid
        var key = 'message_' + uuid
        sessionStorage.setItem(key, JSON.stringify(state))
    },

    Init_Local(state, data) {
        //初始化本地消息列表相关好友的记录
        let idkey = 'talkId_' + data.user.uuid
        let talk = localStorage.getItem(idkey) != null ? JSON.parse(localStorage.getItem(idkey)) : null
        if (talk != null) {
            for (let index = 0; index < talk.length; index++) {
                const id = talk[index];
                Api.postRequest('/message/getByPage', { "to": id }).then(res => {
                    if (res.data.success) {
                        let mss = res.data.data
                        if (mss != null) {
                            Vue.set(state.messageMap, id, mss)
                            //标记最后消息时间
                            let lastmess = mss[mss.length - 1]
                            this.commit('common/setLastMessTime', lastmess)

                        }
                    }
                })

            }
        }
    },
    Init_Friend(state) {
        let friendsMap = this.state['common'].FriendsMap
        if (friendsMap != null) {
            for (const key in friendsMap) {
                const friend = friendsMap[key];
                if (friend.concatInfo != null && friend.concatInfo.unReadTotal > 0) {
                    Api.postRequest('/message/getByPage', { "to": friend.uuid }).then(res => {
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
                    Api.postRequest('/message/getByPage', { "to": Group.uuid }).then(res => {
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
        //更新未读计数
        this.dispatch('common/upDateUnreadTotal', messageData.user)
        if (state.messageMap[messageData.user.uuid] != null) {
            //存在则追加到底部
            state.messageMap[messageData.user.uuid].push(messageData.message)

        } else {
            let messArry = []
            messArry.push(messageData.message)
            Vue.set(state.messageMap, messageData.user.uuid, messArry)
        }
        //置顶用户
        this.commit('common/setUserOnTopOfTalkList', messageData.user)
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


}

const getters = {
    getlastMessage: (state) => (uid) => {
        if (state.messageMap != null) {
            let msgarry = state.messageMap[uid]
            return msgarry != null ? msgarry[msgarry.length - 1] : state.defaultMessage
        } else {
            return state.defaultMessage
        }

    },
    getMessagesByuuid: (state) => (uid) => {
        //格式化、合并时间段
        return state.messageMap[uid] != null ? state.messageMap[uid] : null
    }

}

const actions = {
    //获取聊天记录（未被初始化时），请求格式 { "user": "", "message": "" }
    setMessageMapByUUID(context, messageData) {
        let oldmess = context.state.messageMap[messageData.user.uuid]
        //判断是否已存在旧数据
        if (oldmess != null) {
            //存在说明已经初始化，不操作
            // let newmess = messageData.message
            // let cout = newmess.concat(oldmess)
            // Vue.set(state.messageMap, messageData.uuid, cout)
        } else {
            Vue.set(context.state.messageMap, messageData.user.uuid, messageData.message)
        }

    },

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
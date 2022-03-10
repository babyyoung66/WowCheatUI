import Vue from 'vue'
import Api from "@/utils/Api"

var uuid = sessionStorage.getItem('uuid')
var key = 'message_' + uuid
const state = sessionStorage.getItem(key) != null ? JSON.parse(sessionStorage.getItem(key)) : {
    isInit: false,
    messageMap: {},
    defaultMessage: { "content": "近6个月内没有互动...", "time": "" }
}

const mutations = {
    INIT_Message(state, data) {
        if (!state.isInit) {
            console.log("初始化消息中...")
            // 获取list的消息列表
            //初始化消息列表
            let idkey = 'talkId_' + data.user.uuid
            let talk = localStorage.getItem(idkey) != null ? JSON.parse(localStorage.getItem(idkey)) : null
            // state.messageMap = {}
            talk.forEach(id => {
                Api.postRequest('/message/getByPage', { "to": id }).then(res => {
                    if (res.data.success) {
                        let mss = res.data.data
                        mss != null ? Vue.set(state.messageMap, id, mss) : null
                        
                    }     
                })
            });  
            state.isInit = true         
            console.log("初始化消息完毕...")
        }
    },

    saveState(state) {
        var uuid = sessionStorage.getItem('uuid')
        var key = 'message_' + uuid
        sessionStorage.setItem(key, JSON.stringify(state))
    },
    //获取聊天记录（未被初始化时），请求格式 { "uuid": "", "message": "" }
    setMessageMapByUUID(state, messageData) {
        let oldmess = state.messageMap[messageData.uuid]
        //判断是否已存在旧数据
        if (oldmess != null) {
            //存在说明已经初始化，不操作
            // let newmess = messageData.message
            // let cout = newmess.concat(oldmess)
            // Vue.set(state.messageMap, messageData.uuid, cout)
        } else {
            Vue.set(state.messageMap, messageData.uuid, messageData.message)
        }

    },
    //追加单条消息{ "uuid": "", "message": "" }
    pushOneMessageByUUID(state, messageData) {
        let oldmess = state.messageMap[messageData.uuid]
        if (oldmess != null) {
            //存在则追加到底部
            state.messageMap[messageData.from].push(messageData.message)
        }else{
            let messArry = []
            messArry.push(messageData.message)
            Vue.set(state.messageMap, messageData.uuid, messArry)
        }
    },
    // 查询或追加历史聊天记录,请求格式 { "uuid": "", "message": "" }
    pushMessageArryByUUIDOnTop(state, messageData) {
        if(messageData ==null || messageData.length == 0){
            return
        }   
        let uid = messageData.uuid
        let oldmess = state.messageMap[uid]
        if(oldmess !== null){
            //存在则追加到底部
            let newarry = messageData.message.concat(oldmess)  
            // state.messageMap[messageData[0].from] = newarry
            Vue.set(state.messageMap, uid, newarry)
        }else {
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
        return state.messageMap[uid] != null ? state.messageMap[uid] : null
    }

}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
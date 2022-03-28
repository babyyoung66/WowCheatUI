import { Notification } from 'element-ui';
// @ts-ignore
import SockJS from 'sockjs-client'
// @ts-ignore
import Stomp from 'stompjs'
import router from '@/router/router'
import TimeUtils from '@/utils/TimeUtils'
const state = {
    isInit:false,
    stomp: null,
    reConnectTimes: 0,
    //尝试重连次数
    maxReConnecTime: 10,
    //重连间隔
    reconnectDelay: 5000,
    reConnec: false,
    connecting:false
}


const mutations = {
    INIT_SOCKET(state){

    }
    ,
    removeState(state){
        state.stomp = null
        state.reConnec = false
        state.reConnectTimes == 0   
    }

}

const actions = {
    connect(context) {
        if(context.state.connecting){
            return
        }
        context.state.connecting = true
        const local = JSON.parse(sessionStorage.getItem("currentUser"))  
        if(local == null || local == undefined){
            return
        }
        context.state.stomp = Stomp.over(new SockJS('http://127.0.0.1:9999/WowCheat'));
        context.state.stomp.debug = null
        // stompClient.reconnectDelay = 5000
        //心跳设置
        context.state.stomp.heartbeatIncoming = 30000
        context.state.stomp.heartbeatOutgoing = 30000
        
        let headers = { "token": local.token }
        context.state.stomp.connect(headers, success => {
            console.log("聊天服务连接成功~" + TimeUtils.dateForMatDefault(new Date()))
            //关闭当前可能存在的重连通知
            Notification.closeAll()
            Subscribe()
            //第一次进入，或者重连时提示
            let isInit = JSON.parse(sessionStorage.getItem("isInit"))
            if(!isInit || isInit == null || context.state.reConnec == true){
                Notification.success({
                    title: '系统消息',
                    message: "聊天服务连接成功~",
                    position: "top-right"
    
                });
            }
            context.state.isInit = true
            context.state.reConnec = false
            context.state.reConnectTimes = 0   
            context.state.connecting = false
        }, error => {
            context.state.connecting = false
            if (context.state.reConnectTimes == 0) {
                context.state.reConnec = true
            }
            if (context.state.reConnec && !context.state.stomp.connected) {
                context.dispatch('ReConnect',error)
            }


        })

        let Subscribe = () => {
            context.state.stomp.subscribe('/user/' + local.user.uuid + '/personal', (response) => {
                context.dispatch("MessageCover",response)
            });
            context.state.stomp.subscribe('/topic', (response) => {
                console.log(response.body);
            });

        }

        //stompClient.deactivate();

    },
    ReConnect(context,error) {
        if(router.app._route.name == 'login'){
            return
        }
        if (!context.state.reConnec || context.state.reConnectTimes == 0) {
            Notification.warning({
                title: '系统消息【'+ TimeUtils.dateForMatDefault(new Date())+ '】',
                message: "与聊天服务器断开连接，正在尝试重连中~",
                position: "top-right",
                duration: 0
            });
        }
        setTimeout(() => {
            if (context.state.reConnectTimes >= context.state.maxReConnecTime || context.state.stomp.connected) {
                context.state.reConnec = false
                //关闭当前可能存在的重连通知
                Notification.closeAll()
                if (!context.state.stomp.connected) {
                    console.log("尝试重连失败~" + TimeUtils.dateForMatDefault(new Date()))
                    Notification.error({
                        title: '系统消息【'+ TimeUtils.dateForMatDefault(new Date())+ '】',
                        message: "无法与聊天服务器重连，请尝试刷新或重新登陆系统~" + error,
                        position: "top-right",
                        duration: 0
                    });

                }
            } else {
                context.dispatch('connect')
                context.state.reConnectTimes = context.state.reConnectTimes + 1
                console.log("尝试重连socket服务:" + context.state.reConnectTimes + "次　"+ TimeUtils.dateForMatDefault(new Date()))
            }
        }, context.state.reconnectDelay)
    },

    MessageCover(context,response){
        let result = JSON.parse(response.body)
        if(!result.success){
            Notification.warning({
                title: '系统消息',
                message: result.errorMessage,
                position: "top-right",
                duration: 5000
            });
           return   
        }
        if(result.success){
            let fromid = result.message.from
            //如果发送者为自己，则将消息存入好友id
            if(fromid === this.state['common'].currentUser.user.uuid){
                fromid = result.message.to
            }
            let user = {"uuid":fromid,"type":result.message.msgType}
            let msgData = {"user":user,"message":result.message}
           
            //追加消息
            this.commit('message/pushOneMessageByUUID',msgData)
            this.commit('common/setLastMessTime',result.message)
             
        }
        
    }


}
const getters = {

}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
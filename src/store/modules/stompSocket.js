import { Notification } from 'element-ui';
// @ts-ignore
import SockJS from 'sockjs-client'
// @ts-ignore
import Stomp from 'stompjs'
import router from '@/router/router'
import TimeUtils from '@/utils/TimeUtils'
import constants from '@/utils/constans'
const state = {
    isInit: false,
    stomp: null,
    reConnectTimes: 0,
    //尝试重连次数
    maxReConnecTime: 10,
    //重连间隔
    reconnectDelay: 5000,
    reConnec: false,
    connecting: false,
    //是否需有重连，退出登录时为false，登录时为true，默认为true
    needreConnec: true
}


const mutations = {
    INIT_SOCKET(state) {
        state.needreConnec = true
        this.dispatch('stompSocket/connect')
    }
    ,
    removeState(state) {
        if (state.stomp != null) {
            console.log("stomp已断开...")
            state.stomp.disconnect()
        }
        state.stomp = null
        state.reConnec = false
        state.reConnectTimes = 0
        state.needreConnec = false
    }

}

const actions = {
    connect(context) {
        //正在连接或已连接
        if (context.state.connecting ) {
            return
        }
        if(context.state.stomp != null && context.state.stomp.connected){
            return
        }

        const local = JSON.parse(sessionStorage.getItem("currentUser"))
        if (local == null || local == undefined) {
            return
        }
        context.state.stomp = Stomp.over(new SockJS(constants.socketUrl));
        context.state.stomp.debug = null
        // stompClient.reconnectDelay = 5000
        //心跳设置
        context.state.stomp.heartbeatIncoming = 30000
        context.state.stomp.heartbeatOutgoing = 30000

        let headers = { "token": local.token }

        context.state.connecting = true
        context.state.stomp.connect(headers, success => {
            console.log("聊天服务连接成功~" + TimeUtils.dateForMatDefault(new Date()))
            //关闭当前可能存在的重连通知
            Notification.closeAll()
            //Subscribe()
            context.dispatch('Subscribe')
            //第一次进入，或者重连时提示
            let isInit = JSON.parse(sessionStorage.getItem("isInit"))
            if (!isInit || isInit == null || context.state.reConnec == true) {
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
            if (context.state.reConnec && context.state.needreConnec && !context.state.stomp.connected) {
                context.dispatch('ReConnect', error)
            }
        })
    },
    //订阅
    Subscribe(context) {
        const local = JSON.parse(sessionStorage.getItem("currentUser"))
        // 个人id订阅
        context.state.stomp.subscribe('/user/' + local.user.uuid + '/personal', (response) => {
            context.dispatch("messageAdapter", response)
        });

        // topic订阅
        context.state.stomp.subscribe('/topic', (response) => {
            let result = JSON.parse(response.body)
            if (!result.success) {
                Notification.warning({
                    title: '系统消息',
                    message: result.errorMessage,
                    position: "top-right",
                    duration: 5000
                });
                return
            }
            if (result.success) {
                Notification.info({
                    title: '系统消息',
                    message: result.message,
                    position: "top-right",
                    duration: 0
                });
            }
        });

    },
    ReConnect(context, error) {
        if (router.app._route.name == 'login'|| context.state.connecting) {
            return
        }
        setTimeout(() => {
            if (context.state.reConnectTimes >= context.state.maxReConnecTime || context.state.stomp.connected) {
                //关闭当前可能存在的重连通知
                Notification.closeAll()
                if (!context.state.stomp.connected) {
                    console.log("尝试重连失败~" + TimeUtils.dateForMatDefault(new Date()))
                    Notification.error({
                        dangerouslyUseHTMLString: true,
                        title: '系统消息',
                        message: '【' + TimeUtils.dateForMatDefault(new Date()) + '】<br>无法与聊天服务器重连，请尝试刷新或重新登陆系统~' + error,
                        position: "top-right",
                        duration: 0
                    });

                }
            } else {
                if(context.state.connecting){
                    return
                }
                if (!context.state.reConnec || context.state.reConnectTimes == 0) {
                    Notification.warning({
                        dangerouslyUseHTMLString: true,
                        title: '系统消息',
                        message: '【' + TimeUtils.dateForMatDefault(new Date()) + '】<br>与聊天服务器断开连接，正在尝试重连中~',
                        position: "top-right",
                        duration: 0
                    });
                }
                context.dispatch('connect')
                context.state.reConnectTimes = context.state.reConnectTimes + 1
                console.log("尝试重连socket服务:" + context.state.reConnectTimes + "次　" + TimeUtils.dateForMatDefault(new Date()))
            }
        }, context.state.reconnectDelay)
    },

    /* 消息适配器 */
    messageAdapter(context, response) {
        let result = JSON.parse(response.body)
        if (!result.success) {
            Notification.warning({
                title: '系统消息',
                message: result.errorMessage,
                position: "top-right",
                duration: 5000
            });
            return
        }
        if (result.success) {
            let message = result.message
            let type = result.type
            //普通消息
            if ('cheat' == type) {
                context.dispatch("updateCheatMessage", message)
                return
            }
            //好友请求
            if ('friendRequest' == type) {
                context.dispatch("updateFriendRequest", message) 
                return
            }
            //更新好友列表
            if ('updateFriend' == type) {
                context.dispatch("updateFriendMap", message) 
                return
            }
            //更新群聊列表
            if ('updateGroup' == type) {
                context.dispatch("updateGroupMap", message) 
                return
            }
            //topic通知
            if ('notice' == type) {
                //context.dispatch("messageAdapter", message) 
                return
            }

        }
    },

    updateCheatMessage(context, message) {
        let fromid = message.from
        //如果发送者为自己，则将消息存入好友id
        if (fromid === this.state['common'].currentUser.user.uuid) {
            fromid = message.to
        }
        let msgType = message.msgType
        //群消息时，to固定为群uuid
        if (msgType == 'group') {
            fromid = message.to
            //为群聊时，判断是否已屏蔽
            let GroupsMap = this.state['common'].GroupsMap
            if(GroupsMap[fromid].concatInfo.notifyStatus !== 0){
                return
            } 
        }
        let user = { "uuid": fromid, "type": msgType }
        let msgData = { "user": user, "message": message }
        //追加消息
        this.commit('message/pushOneMessageByUUID', msgData)
        this.commit('common/setLastMessTime', message)
        //更新未读计数
        this.dispatch('common/addUnreadTotal', user)
        //置顶用户
        this.commit('common/setUserOnTopOfTalkList', user)
    },
    updateFriendRequest(context, request) {
        this.commit('common/addFriendRequest',request)
    },
    updateFriendMap(context, friend) {
        this.commit('common/addUser',friend)
        Notification.success({
            title: '系统消息',
            message: '已成功添加【' + friend.name + '】为好友！',
            position: "top-right",
            duration: 5000
        });
    },
    updateGroupMap(context, group) {
        this.commit('common/addGroup',group)
    },

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
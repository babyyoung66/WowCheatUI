/***
 * 所有用户信息更新只更新FriendsMap
 * 所有群组信息更新只更新GroupsMap
 * talkList不进行信息更新，实时从上述两个map获取
 * talkList在退出时会保存相关uuid数组在本地，下次登录时用于初始化消息列表
 */


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
    //当前打开的列表 "talkList" || "friend" || notice
    ListType: "",
    //当前打开的对话对象
    currentCheatObj: { "name": "系统公告", "type": 'notice' },
    //当前查看的好友信息
    checkDetial: null,
    //消息列表
    talkList: [],
    //好友列表
    FriendsMap: {},
    //公告
    noticeList: [],
    //群聊列表
    GroupsMap: {},
    //好友请求列表
    FriendRequestList: [],
    //消息框类型(personal、group、notice)
    messageFormType: "",
    //数字变化时消息框滑动到底部
    MessageFormScroll: 0,
    urlBase: 'http://127.0.0.1:9999',

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

                this.commit('common/InitTalkList', data)

                this.dispatch('message/INIT', data)
                this.dispatch('stompSocket/connect');
                this.commit('common/InitFriendRequet')
                state.isInit = true
            });

        }

    },
    InitTalkList(state, data) {
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
    },
    InitFriendRequet(state) {
        //获取好友请求列表
        Api.postRequest('/friend/getRequestList', {}).then(res => {
            if (res.data.success && res.data.data != null) {
                let list = res.data.data
                list.forEach(element => {
                    element.userInfo.type = 'personal'
                });
                state.FriendRequestList = list
            }
        })
    },

    //state默认参数
    saveState(state) {
        //未打开消息或通讯录列表时，清空currentCheatObj再保存
        let uuid = sessionStorage.getItem("uuid")
        let key = 'common_' + uuid
        sessionStorage.setItem(key, JSON.stringify(state))
        this.commit('common/saveTalkId',{})
    },
    saveTalkId(state){
        let uuid = sessionStorage.getItem("uuid")
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
        state.messageFormType = ""
        state.currentUser = {}
        state.GroupsMap = {}
        state.FriendRequestList = []
        state.noticeList = []
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
    //更新当前聊天对象
    setCurrentCheatObj(state, user) {
        if ('personal' == user.type && state.FriendsMap[user.uuid] != null) {
            state.currentCheatObj = state.FriendsMap[user.uuid]
            return
        }
        if ('group' == user.type && state.GroupsMap[user.uuid] != null) {
            state.currentCheatObj = state.GroupsMap[user.uuid]
            return
        }
    },

    setmessageFormType(state, type) {
        state.messageFormType = type
    },
    setCheckDetial(state, user) {
        if ('personal' == user.type && state.FriendsMap[user.uuid] != null) {
            state.checkDetial = state.FriendsMap[user.uuid]
            return
        }
        if ('group' == user.type && state.GroupsMap[user.uuid] != null) {
            state.checkDetial = state.GroupsMap[user.uuid]
            return
        }
        state.checkDetial = user
    },
    //将用户置顶到聊天列表(设置消息时间戳，已在getters中按时间戳降序排列)
    setUserOnTopOfTalkList(state, user) {
        //当前消息列表不存在用户时
        let NotIn = true
        for (let index = 0; index < state.talkList.length; index++) {
            const element = state.talkList[index];
            if (element.uuid == user.uuid) {
                NotIn = false
                break
            }
        }
        if (NotIn) {
            if ('personal' == user.type && state.FriendsMap[user.uuid] != null) {
                let info = state.FriendsMap[user.uuid]
                state.talkList.unshift(info)
                return
            }
            if ('group' == user.type && state.GroupsMap[user.uuid] != null) {
                let info = state.GroupsMap[user.uuid]
                state.talkList.unshift(info)
                return
            }
        }
        //使用现有的commit(模拟message类型格式)
        let msg = { "from": user.uuid, "to": user.uuid, "msgType": user.type, "time": '' }
        this.dispatch('common/setLastMessTime', msg)
    },
    //user={"uuid":,"type":"personal(group)"}
    upDateUnreadTotal(state, user) {
        //是当前聊天对象则不更新
        if (user.uuid == state.currentCheatObj.uuid) {
            return
        }
        if (user.type === 'personal') {
            let usr = state.FriendsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = state.FriendsMap[user.uuid].concatInfo.unReadTotal
                state.FriendsMap[user.uuid].concatInfo.unReadTotal = total + 1
            }
            return
        }

        if (user.type === 'group') {
            let usr = state.GroupsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = state.GroupsMap[user.uuid].concatInfo.unReadTotal
                state.GroupsMap[user.uuid].concatInfo.unReadTotal = total + 1
            }
            return
        }

    },
    setLastMessTime(state, message) {
        let time = TimeUtils.getMillis(message.time)
        let from = message.from
        if (from == state.currentUser.user.uuid) {
            from = message.to
        }

        if (state.FriendsMap[from] != null && message.msgType == 'personal') {
            Vue.set(state.FriendsMap[from], 'lastMessTime', time)
            return
        }
        if (state.GroupsMap[message.to] != null && message.msgType == 'group') {
            Vue.set(state.GroupsMap[message.to], 'lastMessTime', time)
            return
        }

    },
    removeFromTalkList(state, user) {
        if (user.uuid == state.currentCheatObj.uuid) {
            state.currentCheatObj = {}
        }
        for (let index = 0; index < state.talkList.length; index++) {
            const element = state.talkList[index];
            if (element.uuid = user.uuid) {
                state.talkList.splice(index, 1)
                break
            }
        }
    },
    deleteUser(state, user) {
        this.commit('common/removeFromTalkList', user)
        if (user.uuid == state.checkDetial.uuid) {
            state.checkDetial = null
        }
        if (user.type == 'personal' && state.FriendsMap[user.uuid] != null) {
            Vue.delete(state.FriendsMap, user.uuid)
            return
        }
        if (user.type == 'group' && state.GroupsMap[user.uuid] != null) {
            Vue.delete(state.GroupsMap, user.uuid)
            return
        }
    },
    addUser(state, user) {
        if (user == null || user.uuid == null) {
            return
        }
        Vue.set(user, 'type', 'personal')
        Vue.set(state.FriendsMap, user.uuid, user)
    },
    addGroup(state, group) {
        if (group == null || group.uuid == null) {
            return
        }
        Vue.set(group, 'type', 'group')
        Vue.set(state.GroupsMap, group.uuid, group)
    },
    addFriendRequest(state, request) {
        for (let index = 0; index < state.FriendRequestList.length; index++) {
            const element = state.FriendRequestList[index]
            if (element.autoId == request.autoId) {
                state.FriendRequestList.splice(index, 1)
                break
            }
        }
        state.FriendRequestList.unshift(request)
    }
}

//提交的是 mutation,即将mutations的方法异步执行
const actions = {
    //异步初始化
    INIT(context, data) {
        context.commit('INIT', data)
    },
    //更新好友或群聊联系时间,更新friendMap数据，而不是talkList
    upDateConcatTime(context, user) {
        if (user == null || user == undefined) {
            return
        }
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
    //用于退出时
    upDateConcatTimeForLogout(context, user) {
        if (user == null || user == undefined) {
            return
        }
        let uuid = user.uuid
        //自己则不处理
        if (uuid == context.state.currentUser.user.uuid) {
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
        context.commit('upDateUnreadTotal', user)

    },
    //message类,标记最后消息时间,只用于初始化时排序
    setLastMessTime(context, mess) {
        context.commit('setLastMessTime', mess)
    }

}

//相当于vue的computed，计算过滤返回数据
const getters = {
    getListType: (state) => {
        return state.ListType === '' ? 'notice' : state.ListType
    },
    getListByType: (state) => (type) => {

        if (type == 'talkList') {
            let data = []
            state.talkList.forEach(element => {
                let usr = state.FriendsMap[element.uuid]
                if (usr != null) {
                    data.push(usr)
                }

            });
            state.talkList = _.orderBy(data, 'lastMessTime', 'desc')

            return state.talkList
            //返回降序内容，按最后一条消息排
            //return _.orderBy(state.talkList,'lastMessTime','desc')
        }
        if (type == 'friend') {
            if (state.FriendsMap != null) {
                let data = []
                let object = state.FriendsMap
                for (const key in object) {
                    data.push(object[key])
                }
                //按名字升序排
                let first = _.orderBy(data, 'name')
                //按备注升序排
                let second = first.sort((a, b) => {
                    if (a.uuid == state.currentUser.user.uuid || b.uuid == state.currentUser.user.uuid) {
                        return
                    }
                    if (a.concatInfo == null || b.concatInfo == null) {
                        return
                    }
                    return a.concatInfo.remarks.localeCompare(b.concatInfo.remarks, 'zh')
                })
                return second
            }
        }
        if (type == 'notice') {
            //返回降序内容，根据时间和置顶级别
            return _.orderBy(state.noticeList, ['createTime', 'top'], 'desc')
        }
    },
    getTalkList: (state) => {
        if (state.talkList != null && state.talkList.length > 0) {
            let data = []
            state.talkList.forEach(element => {
                let usr = state.FriendsMap[element.uuid]
                if (usr != null) {
                    data.push(usr)
                }

            });
            state.talkList = _.orderBy(data, 'lastMessTime', 'desc')
            return state.talkList
        }
        return null
    },
    getFriendsList: (state) => {
        if (state.FriendsMap != null) {
            let data = []
            let object = state.FriendsMap
            for (const key in object) {
                data.push(object[key])
            }
            //按名字升序排
            let first = _.orderBy(data, 'name')
            //按备注升序排
            let second = first.sort((a, b) => {
                if (a.uuid == state.currentUser.user.uuid || b.uuid == state.currentUser.user.uuid) {
                    return
                }
                if (a.concatInfo == null || b.concatInfo == null) {
                    return
                }
                return a.concatInfo.remarks.localeCompare(b.concatInfo.remarks, 'zh')
            })
            //过滤已被拉黑的用户
            return second.filter((usr) => {
                if (usr.uuid == state.currentUser.user.uuid) {
                    return usr
                }
                if (usr.concatInfo.status != 3) {
                    return usr
                }
            })

        }
        return null

    },
    getGroupsList: (state) => {
        if (state.GroupsMap != null) {
            let data = []
            let object = state.GroupsMap
            for (const key in object) {
                data.push(object[key])
            }
            //按名字升序排
            let first = _.orderBy(data, 'name')
            //按备注升序排
            let second = first.sort((a, b) => {
                if (a.concatInfo == null || b.concatInfo == null) {
                    return
                }
                return a.concatInfo.remarks.localeCompare(b.concatInfo.remarks, 'zh')
            })
            return second
        }
        return null

    },
    getNoticeList: (state) => {
        if (state.noticeList != null && state.noticeList.length > 0) {
            return state.noticeList
        }
        return null
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
        if (state.ListType == 'notice') {
            return { "name": "系统公告", "type": 'notice' }
        }
        if (state.ListType == 'talkList' && state.currentCheatObj != null) {
            return state.currentCheatObj
        }
        if (state.ListType == 'friend' && state.checkDetial != null) {
            return state.checkDetial
        }
        return { "name": "系统公告", "type": 'notice' }
    }

}
export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
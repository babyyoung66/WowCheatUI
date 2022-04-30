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
    GroupMember: {},
    //好友请求列表
    FriendRequestList: [],
    //消息框类型(personal、group、notice)
    messageFormType: "",
    //数字变化时消息框滑动到底部
    MessageFormScroll: 0,
    //用户不存在
    noThatUser: { "uuid": "undefined", "name": "undefined", "wowId": "该用户存在或已注销...", "sex": 2, "photourl": "../static/photo_default.webp", "address": '' }

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
                Api.postRequest('/group/getGroupList').then(res => {
                    if (res.data.success) {
                        let list = res.data.data
                        list.forEach(element => {
                            Vue.set(element, 'type', 'group')
                            Vue.set(state.GroupsMap, element.uuid, element)
                        });
                    }
                    //添加后将消息初始化放至该位置
                    this.dispatch('message/INIT', data)
                    this.dispatch('stompSocket/connect');
                    this.commit('common/InitFriendRequet')
                    this.commit('common/InitGroupMember', data)
                    this.commit('common/InitTalkList', data)
                    state.isInit = true
                })

            });

        }

    },
    InitTalkList(state, data) {
        //初始化消息列表
        let idkey = 'talkList_' + data.user.uuid
        let talk = JSON.parse(localStorage.getItem(idkey))
        if (talk != null) {
            state.talkList = talk
        }
    },
    InitGroupMember(state, data) {
        //初始群成员，如新人入群则会在获取时添加没有信息的，加入新群时，根据新群信息增添
        let idkey = 'groupMember_' + data.user.uuid
        let members = JSON.parse(localStorage.getItem(idkey))
        if (members != null) {
            state.GroupMember = members
        }else{
            Api.postRequest('/groupMember/getMembers').then(res => {
                if(res.data.success){
                    let users = res.data.data
                    users.forEach(element => {
                        Vue.set(state.GroupMember, element.uuid, element)
                    });
                }
            })
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
        this.commit('common/saveTalkList', {})
        this.commit('common/saveGroupMember', {})
    },
    saveTalkList(state) {
        let uuid = sessionStorage.getItem("uuid")
        let idkey = 'talkList_' + uuid
        localStorage.setItem(idkey, JSON.stringify(state.talkList))
    },
    saveGroupMember(state) {
        let uuid = sessionStorage.getItem("uuid")
        let idkey = 'groupMember_' + uuid
        localStorage.setItem(idkey, JSON.stringify(state.GroupMember))
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

        //当前消息列表已存在则先删除
        for (let index = 0; index < state.talkList.length; index++) {
            const element = state.talkList[index];
            if (element.uuid == user.uuid) {
                state.talkList.splice(index, 1)
                break
            }
        }
        let info = { "uuid": user.uuid, "type": user.type }
        state.talkList.unshift(info)

        //使用现有的commit(模拟message类型格式)
        let msg = { "from": user.uuid, "to": user.uuid, "msgType": user.type, "time": '' }
        this.dispatch('common/setLastMessTime', msg)
    },
    //user={"uuid":,"type":"personal(group)"}
    upDateUnreadTotal(state, user) {

        //是当前聊天对象则不更新
        // if (user.uuid == state.currentCheatObj.uuid) {
        //     return
        // }

        if (user.type == 'personal') {
            let usr = state.FriendsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = state.FriendsMap[user.uuid].concatInfo.unReadTotal
                state.FriendsMap[user.uuid].concatInfo.unReadTotal = total + 1
                return
            }
        }
        if (user.type == 'group') {
            let usr = state.GroupsMap[user.uuid]
            if (usr != null && usr != undefined) {
                let total = state.GroupsMap[user.uuid].concatInfo.unReadTotal
                state.GroupsMap[user.uuid].concatInfo.unReadTotal = total + 1
                return
            }
        }

    },
    setLastMessTime(state, message) {
        let time = TimeUtils.getMillis(message.time)
        let from = message.from
        if (from == state.currentUser.user.uuid) {
            from = message.to
        }

        if (message.msgType == 'personal' && state.FriendsMap[from] != null) {
            Vue.set(state.FriendsMap[from], 'lastMessTime', time)
            return
        }
        if (message.msgType == 'group' && state.GroupsMap[message.to] != null) {
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
            if (element.uuid == user.uuid) {
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
        let Data = null
        if (user.type == 'personal') {
            //个人
            Data = context.state.FriendsMap

        } else if (user.type == 'group') {
            //群聊，预留，后台未开发
            Data = context.state.GroupsMap
            Api.postByXWForm('/group/UpdateConcatTime', { "uuid": uuid })
        }
        if (Data == null) {
            return
        }
        if (Data[uuid].concatInfo != null && Data[uuid].concatInfo.unReadTotal <= 0) {
            //未读已清0，不重复请求
            return
        }
        if (user.type == 'personal') {
            //个人 context.state.FriendsMap[uuid]
            Data[uuid].concatInfo.unReadTotal = 0  //未读清0
            Api.postByXWForm('/friend/UpdateConcatTime', { "uuid": uuid })

        } else if (user.type == 'group') {
            //群聊，预留，后台未开发 context.state.GroupsMap[uuid]
            Data[uuid].concatInfo.unReadTotal = 0  //未读清0
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
            context.state.GroupsMap[uuid].concatInfo.unReadTotal = 0  //未读清0
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
    getTalkList: (state) => {
        if (state.talkList != null && state.talkList.length > 0) {
            let data = []
            for (let index = 0; index < state.talkList.length; index++) {
                const element = state.talkList[index];
                let info = null
                if (element.type == 'personal' && state.FriendsMap[element.uuid] != null) {
                    let user = state.FriendsMap[element.uuid]
                    //talkList只存三个属性，lastMessTime用于排序
                    info = { "uuid": user.uuid, "type": user.type, "lastMessTime": user.lastMessTime }
                }
                if (element.type == 'group' && state.GroupsMap[element.uuid] != null) {
                    let group = state.GroupsMap[element.uuid]
                    //talkList只存三个属性，lastMessTime用于排序
                    info = { "uuid": group.uuid, "type": group.type, "lastMessTime": group.lastMessTime }
                }

                if (info != null) {
                    data.push(info)
                }

            }
            // state.talkList.forEach(element => {            

            // });
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
    //获取好友或群聊信息,参数类型：{ "uuid": user.uuid, "type": user.type }
    getFriendOrGroupInfo: (state) => (user) => {
        if (state.currentUser.user.uuid == user.uuid) {
            return state.currentUser.user
        }
        if ('personal' == user.type) {
            //朋友
            if (state.FriendsMap != null && state.FriendsMap[user.uuid] != null) {
                return state.FriendsMap[user.uuid]
            }
        } else if ('group' == user.type) {
            if (state.GroupsMap != null && state.GroupsMap[user.uuid] != null) {
                return state.GroupsMap[user.uuid]
            }
        }
        return state.noThatUser
    },
    getFriendInfoByuuid: (state) => (uid) => {
        if (state.currentUser.user.uuid == uid) {
            return state.currentUser.user
        }
        if (state.FriendsMap != null && state.FriendsMap[uid] != null) {
            return state.FriendsMap[uid]
        }
        return state.noThatUser
    },

    //获取群聊成员信息
    getGroupMemberInfoByuuid: (state) => (uuid) => {
        if (state.currentUser.user.uuid == uuid) {
            return state.currentUser.user
        }
        //先从本地获取，不为空则返回，为空则查询数据库
        if (state.GroupMember != null) {
            if (state.GroupMember[uuid] != null) {
                return state.GroupMember[uuid]
            } else {
                Api.postByXWForm('/user/queryUserByUid', { "uuid": uuid }).then(res => {
                    if (res.data.success && res.data.data != null) {
                        Vue.set(state.GroupMember, uuid, res.data.data)
                        return res.data.data
                    } else {
                        Vue.set(state.GroupMember, uuid, state.noThatUser)
                        return state.noThatUser
                    }
                    
                })
                console.clear()
            }
    
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
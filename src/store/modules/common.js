// // 公共数据、状态模块
// //定时器获取uuid，确保已经获取到
// var uuid = sessionStorage.getItem("uuid")
// if (uuid == null) {
//     uuid = "default"
//     console.log("取默认uuid")
// }
// var key = 'common_' + uuid
// const state = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {
//     //当前登录用户信息
//     currentUser: JSON.parse(localStorage.getItem("currentUser")),
//     //不能使用token，需要带修饰，不然会被undefined
//     user_token: "",

// }

// //更新state对象数据的方法
// const mutations = {
//     INIT(state, uuid) {
//         state = {
//             //当前登录用户信息
//             currentUser: {},
//             //不能使用token，需要带修饰，不然会被undefined
//             user_token: "",
//         }
//     },

//     //state默认参数
//     saveState(state) {
//         uuid = sessionStorage.getItem("uuid")
//         key = 'common_' + uuid
//         localStorage.setItem(key, JSON.stringify(state))
//     },
//     removeState(state) {
//         uuid = sessionStorage.getItem("uuid")
//         key = 'common_' + uuid
//         localStorage.removeItem(key)
//     },

//     setUserinfo(state, data) {
//         state.currentUser = data.user
//         state.user_token = data.token
//         state.token = data.token
//     },

//     setToken(state, token) {
//         state.user_token = token
//     },

// }

// //提交的是 mutation,即将mutations的方法异步执行
// const actions = {


// }

// //相当于vue的computed，计算过滤返回数据
// const getters = {
//     get(state) {
//         console.log("common")
//     }
// }


// export default {
//     namespaced: true,
//     state,
//     mutations,
//     getters,
//     actions
// }
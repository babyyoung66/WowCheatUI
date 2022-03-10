/* 封装axios请求 */
import axios from 'axios';
import { Message } from "element-ui";
import router from '../router/router'
// 引入vuex的store，方便在请求方法直接设置状态
import store from '../store/store'
import qs from 'qs'

axios.defaults.timeout = 5000
//axios.defaults.headers.post['Content-Type'] = 'application/json';


//全局配置，告诉浏览器无论如何都要携带cookie去请求资源
//axios.defaults.withCredentials = true

/* 请求服务地址 */
const base = 'http://127.0.0.1:8080';

//给全局请求添加Token
axios.interceptors.request.use(config => {
  const local = JSON.parse(localStorage.getItem("currentUser"))
  if (local != null) {
    const token = local.token
    if (token != null && token != "") {
      config.headers.token = token
    }
  }

  return config
},
  error => {
    return Promise.reject(error)
  })

/*axios全局响应拦截*/
axios.interceptors.response.use(success => {
  if (success.status && success.status == 200 && success.data.success == false) {//请求成功，但处理出现其他错误
    Message.error({ message: success.data.message })
    return success;
  }
  //请求成功且服务器处理无错误
  if (success.data.success) {
    let token = success.headers['newtoken']
    if (token !== null) {
      store.state['common'].token = token
    }
    return success;
  }

}, error => {
  if (error.response == null) {
    Message.error({ message: "页面请求错误！" + error })
    console.log(error)
    return
  }

  if (error.response.status == 504) {//	充当网关或代理的服务器，未及时从远端服务器获取请求
    Message.error({ message: '找不到服务器!' })
  }
  else if (error.response.status == 403) {	//已登录，但是权限不足

    if (error.response.data != null) {
      Message.error({ message: error.response.data.message })
    } else {
      Message.error({ message: '权限不足，请联系管理员!' })
    }

  }
  else if (error.response.status == 400) {
    Message.error({ message: '请求方式错误!' });
    // router.replace("/");//跳转到登陆页
  }

  else if (error.response.status == 401) {//请求要求用户的身份认证
    sessionStorage.clear()
    store.commit('removeState')
    if (error.response.data != null) {
      Message.error({ message: error.response.data.message })
    } else {
      Message.error({ message: '尚未登录，请登录!' });
    }
    router.replace("/login");//跳转到登陆页
  } else if (error.response.status == 404) {
    Message.error({ message: '服务器未找到请求资源!' })
  } else if (error.response.status == 405) {
    Message.error({ message: '服务请求方式错误!' })
  } 
  else if (error.response.status == 500) {
    Message.error({ message: '服务器内部错误，无法完成请求!' })
  } else {
    if (error.response.data) {
      Message.error({ message: error.response.data.message })
    }
    else {
      Message.error({ message: '未知错误!' })
    }
  }
  return;
})
// Content-Type: application/json ： 请求体中的数据会以json字符串的形式发送到后端
// Content-Type: application/x-www-form-urlencoded：请求体中的数据会以普通表单形式（键值对）发送到后端
// Content-Type: multipart/form-data： 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。

const Api = {

  logoutRequest(url) {
    axios({
      method: 'post',
      url: `${base}${url}`,
    })
      .then(res => {

      }).finally(() => {
        store.commit('removeState')
      })
  },

  postRequest(url, params) {
    return axios({
      method: 'post',
      url: `${base}${url}`,
      data: params,
      // headers: {'Content-Type': 'application/json/form-data/x-www-form'}
    });
  },

  // 封装form-data请求,文件上传用
  postByFormData(url, params) {
    return axios({
      method: 'post',
      url: `${base}${url}`,
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    })

  },

  // 封装x-www-form请求,将JSON转换成form表单
  postByXWForm(url, params) {
    let form = qs.stringify(params)
    return axios({
      method: 'post',
      url: `${base}${url}`,
      data: form,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

  },
  /**
   * 封装文件访问请求
   * @param {*} url 
   */
  getResouce(url) {
    axios({
      method: 'get',
      url: url,
      responseType: 'blob'
    }).then(res => {
      return URL.createObjectURL(res.data)
    })
  },

  /** 
   *封装“查询”请求方法——get
   */
  getRequest(url, params) {
    return axios({
      method: 'get',
      url: `${base}${url}`,
      data: params
    });
  },

  /*
  封装“删除”请求方法——get
   */
  deleteRequest(url, params) {
    return axios({
      method: 'delete',
      url: `${base}${url}`,
      data: params
    });
  },
  /*   
  封装“修改”请求方法——put
   */
  putRequest(url, params) {
    return axios({
      method: 'put',
      url: `${base}${url}`,
      data: params
    });
  },

  /*
   封装二维码获取方法
   */
  CreateQRCod(url) {
    return axios({
      method: 'get',
      url: `${base}${url}`,
      /* blob流对象 */
      responseType: 'blob'
    });
  }

}
export default Api;
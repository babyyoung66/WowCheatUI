/* 封装axios请求 */
import axios from 'axios';
import {Message} from "element-ui";
import router from '../router/router'


/* 请求服务地址 */
const base='http://127.0.0.1:8080';

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
      });
}

/*
封装“查询”请求方法——get
 */
export const getRequest = (url, params) => {
    return axios({
      method: 'get',
      url: `${base}${url}`,
      data: params
    });
  }

/*
封装“删除”请求方法——get
 */
export const deleteRequest = (url, params) => {
    return axios({
      method: 'delete',
      url: `${base}${url}`,
      data: params
    });
  } 
/*   
封装“修改”请求方法——put
 */
export const putRequest = (url, params) => { 
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  });
}  

/*
 封装二维码获取方法
 */
export const CreateQRCode = (url) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        /* blob流对象 */
        responseType: 'blob'
    });
}

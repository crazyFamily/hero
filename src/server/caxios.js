// 导入axios
import axios from 'axios';
import ShowToast from '../components/myTosat/myTosat'
import {isWeChat} from "../common/common.js"
import router from '../router'
// import store from '../store'
// 进行一些全局配置
// 公共路由(网络请求地址)
/* let baseURL = process.env.NODE_ENV === 'development'
  ? 'https://console-mock.apipost.cn/app/mock/project/24604e84-1f44-4bc2-9c2d-1b5e801797b5/'
  : ('https:' == document.location.protocol ? 'https://' : 'http://') +
  document.domain +'/project/e21010401'; */

let baseURL = "https://console-mock.apipost.cn/app/mock/project/24604e84-1f44-4bc2-9c2d-1b5e801797b5/"

// 创建一个axios实例
const cAxios = axios.create({
  baseURL: baseURL, // url = base url + request url
  timeout: 8000 // 设置超时时间为10s
});

// request拦截器 ==> 对请求参数进行处理
cAxios.interceptors.request.use(
  config => {
    /* config.cancelToken = new axios.CancelToken(function (cancel) {
      store.commit('pushToken', {cancelToken: cancel})
    }) */
    return config;
  }, error => {
    // 处理网络异常，请刷新重试
    Promise.reject(error);
  }
);


// respone拦截器 ==> 对响应做处理
cAxios.interceptors.response.use(
  response => {
    const res = response.data;
    if (response.status !== 200) {
      return Promise.reject(response)
    }else if(res.status==-1008){
      // router.replace("/login");
      if(!isWeChat()){
        //尚未登录 -- 非微信环境跳登录
        router.replace("/login");
      }
      return Promise.resolve(res)
    } else {
      return Promise.resolve(res)
    }
  }, error => {
    console.log("错误状态--")
    console.log(error)
    var originalRequest = error.config;
    // 请求超时重新请求，只会重新请求一次 
    if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){
      return Promise.reject({...error,errname:"请求超时"})
    }
    // 判断error的status代码，并将对应的信息告知用户
    let text = "";
    let err = JSON.parse(JSON.stringify(error));

    if (err.response.status) {
      switch (error.response.status) {
        case 400:
          text = "网络异常，请刷新重试(400)，请重新申请";
          break;
        case 401:
          text = "登录错误(401)，请重新登录";
          break
        default:
          text = "网络连接出错";
      }
    } else {
      text = "连接服务器失败,请退出重试!";
    }
    ShowToast({
      message: text,
      showMask: true
    })
    return Promise.reject(error);
  }
);

// 将写好的axios实例暴露出去
export default cAxios;

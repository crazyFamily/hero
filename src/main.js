import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {getScreenSize} from "./common/common.js"
import FastClick from 'fastclick'

FastClick.attach(document.body);

Vue.config.productionTip = false

import qs from 'qs'
Vue.prototype.$qs = qs;
// 接口
import $https from "./server/https"
Vue.prototype.$https = $https;
// 公共提示
import ShowToast from './components/myTosat/myTosat'
Vue.prototype.$ShowToast = ShowToast;

getScreenSize(()=>{});

router.beforeEach((to, from, next) => {
  if(store.state.isInit==-1){
    let params = qs.stringify({});
    $https.init(params).then((res) => {
      let msg = res;
      if (msg.code == 200) {
        console.log("进去了1")
        store.commit('setinitData',msg.data)
        console.log(msg.data.isVote)
        store.commit('setVote',msg.data.isVote)
        console.log("进去了2")
        next()
      }else{
        ShowToast({
          message: msg.content,
          showMask: true
        })
      }
    }).catch((err) => {
      if(err.errname && err.errname=="请求超时"){
        ShowToast({
          message: err.content,
          showMask: true
        })
      }
    })
  }else{
    next()
  }
  
  
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

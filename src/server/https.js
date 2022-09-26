// 导入封装好的网络请求类工具
import cAxios from './caxios';

let pupath = ""

// 初始化 init
const init = data => {
    return cAxios({
        url: pupath+"init",
        method: "post",
        data
    });
};

// 总排行
const rankList = data => {
    return cAxios({
        url: pupath+"rankList",
        method: "post",
        data
    });
};
// 抽奖记录
const luckRecord = data => {
    return cAxios({
        url: pupath+"luckRecord",
        method: "post",
        data
    });
};
// 线索列表
const cluelist = data => {
    return cAxios({
        url: pupath+"cluelist",
        method: "post",
        data
    });
};
// 线索详情 clueDetail
const clueDetail = data => {
    return cAxios({
        url: pupath+"clueDetail",
        method: "post",
        data
    });
};
// 点亮线索
const vote = data => {
    return cAxios({
        url: pupath+"vote",
        method: "post",
        data
    });
};
// 提供线索 createClue
const createClue = data => {
    return cAxios({
        url: pupath+"createClue",
        method: "post",
        data
    });
};
// 姓名检索 check
const checkname = data => {
    return cAxios({
        url: pupath+"check",
        method: "post",
        data
    });
};
// 抽奖
const luck = data => {
    return cAxios({
        url: pupath+"luck",
        method: "post",
        data
    });
};
// 提交UM号 subumid
const subumid = data => {
    return cAxios({
        url: pupath+"subumid",
        method: "post",
        data
    });
};



// 不固定url
const randform = (path,data) => {
    return cAxios({
        url: pupath+path,
        method: "post",
        data
    });
};

const setCookie = (c_name,value,expire) =>{
  var date=new Date()
  date.setSeconds(date.getSeconds()+expire)
  document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
}
const getcookies = c_name => {
  if (document.cookie.length>0){
  let c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1){ 
      c_start=c_start + c_name.length+1 
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
      } 
  }
  return ""
}


// this.$https.uploadpdf
export default {
    init,
    rankList,
    luckRecord,
    cluelist,
    clueDetail,
    vote,
    createClue,
    checkname,
    luck,
    subumid,
    randform,
    setCookie,
    getcookies
}
import { Promise } from "core-js"

export function testSize(e,$this){
  return new Promise((resolve) => {
    let files = e.target.files[0];
    console.log(files)
    let itype = files.type;
    let size = files.size/(1024*1024);
    if(size>5){ // 大于5M
      $this.$ShowToast({
        message: "文件需要小于5M"
      })
    }else{
      getbase64(files,itype).then((res)=>{
        resolve(res)
      });
    }
  });
}

function getbase64(file,itype){
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file);
    //开始转
    reader.onload = function() {
      fileResult = reader.result;
      
    };
    //转 失败
    reader.onerror = function(error) {
      reject(error);
    };
    //转 结束  咱就 resolve 出去
    reader.onloadend = function() {
      // resolve(fileResult);
      compressImg(fileResult,itype,(base64)=>{
        resolve(base64);
        
      })
    };
  });
}
function compressImg (base64,itype,callback) {
  let scale = 0.89;
  let itypes = itype ? itype : "image/png"
  // 处理缩放，转换格式
  // 下面的注释就不写了，就是new 一个图片，用canvas来压缩
  const img = new Image()
  img.src = base64
  img.onload = function () {
    console.log("compressImg12")
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    let imgW = img.width;
    let imgH = img.height;
    let imgscale = 1
    if(imgW>1000){
      imgscale = 1000/imgW
    }else if(imgH>1000){
      imgscale = 1000/imgH
    }
    canvas.width = imgW*imgscale;
    canvas.height = imgH*imgscale;
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    // 转成base64 文件
    let base64 = canvas.toDataURL(itypes)
    // 根据自己需求填写大小 我的目标是小于3兆
    while (base64.length > 1024 * 1024 * 5) {
      scale -= 0.01
      base64 = canvas.toDataURL(itypes, scale)
    }
    callback(base64)
  }
}




export function getScreenSize(callback){
  if (typeof window.WeixinJSBridge == "object" && typeof window.WeixinJSBridge.invoke == "function") {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    } else if (document.attachEvent) {
      //IE浏览器，非W3C规范
      document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
    }
  }
  function handleFontSize() {
    // 设置网页字体为默认大小
    window.WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
    // 重写设置网页字体大小的事件
    window.WeixinJSBridge.on('menu:setfont', function () {
      window.WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
    })
  }
  /**
     * css元素尺寸=设计稿元素尺寸/100;
     */
   var psw = 750,//设计稿尺寸
   maxW = window.screen.height / 1.8;//pc最大尺寸
    var change = 'orientationchange' in window ? 'orientationchange' : 'resize';
    function calculate() {
      var deviceWidth = document.documentElement.clientWidth;
      console.log("deviceWidth--"+deviceWidth)
      if (deviceWidth < 320) {
        deviceWidth = 320;
      }
      if (!is_mobile()) {
        if (deviceWidth >= maxW) {
          deviceWidth = maxW;
        }
      }
      if(deviceWidth>1100) {
        document.documentElement.style.fontSize = "16px"
      }else{
        document.documentElement.style.fontSize = deviceWidth / psw * 100 + 'px'
      }
      console.log("deviceWidth--"+deviceWidth / psw * 100 + 'px');
      callback();
    }
    var timer;
    window.addEventListener(change, function () {
      clearTimeout(timer);
      timer = setTimeout(calculate, 300);
    }, false);
    calculate();
}
export function is_mobile() {
  var reg = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i;
  return reg.test(navigator.userAgent.toLowerCase());
}

export function isWeChat(){
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    return true;
  }else{
    return false;
  }
}

export function jsanimate(obj, json, interval, sp, fn) {
  clearInterval(obj.timer);
  //var k = 0;
  //var j = 0;
  function getStyle(obj, arr) {
    if(obj.currentStyle){
      return obj.currentStyle[arr];  //针对ie
    } else {
      return document.defaultView.getComputedStyle(obj, null)[arr]; 
    }
  }
  obj.timer = setInterval(function(){
    //j ++;
    var flag = true;
    for(var arr in json) {
      var icur = 0;
      //k++;
      if(arr == "opacity") {
        icur = Math.round(parseFloat(getStyle(obj, arr))*100);
      } else {
        icur = parseInt(getStyle(obj, arr));
      }
      var speed = (json[arr] - icur) * sp;
      speed = speed > 0 ? Math.ceil(speed): Math.floor(speed);
      if(icur != json[arr]){
        flag = false;
      } 
      if(arr == "opacity"){
        obj.style.filter = "alpha(opacity : '+(icur + speed)+' )";
        obj.style.opacity = (icur + speed)/100;
      }else {
        obj.style[arr] = icur + speed + "px";
      }
    }

    if(flag){
      clearInterval(obj.timer);
      
      if(fn){
        fn();
      }
    }
  },interval);
}

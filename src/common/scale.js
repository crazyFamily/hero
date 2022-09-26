import Hammer from 'hammerjs'// 引用hammerjs
import Vue from 'vue'
// 定义缩放方法，接收一个element参数：使用export暴露该方法
export function zoomElement (el) {
  function point2D (x, y) {
    return { x: x, y: y }
  }
  // 判断 正数，负数，不是数字
  function checkNumType (num) {
    var reg = new RegExp("^-?[0-9]*.?[0-9]*$")
    if (reg.test(num)) { // 用于检测一个字符串是否匹配某个模式
      var absVal = Math.abs(num) // 如果参数是非负数，则返回该参数；如果参数是负数，则返回该参数的相反数。
      return num == absVal ? true : false
    } else {
      console.log('this is not number')
    }
  }
  function exChangeNum (num, reNum) {
    let flag = checkNumType(num)
    let reFlag = checkNumType(reNum)
    let realNum = 0
    if (!flag && reFlag) {
      realNum = Number('-' + reNum)
    } else {
      realNum = Number(reNum)
    }
    return realNum
  }
  var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  })()
  var ticking = false
  var tMatrix = [1, 0, 0, 1, 0, 0] //x缩放，无，无，y缩放，x平移，y平移
  var initScale = 1 //初始化scale
  var mc = new Hammer.Manager(el)
  var nowScale = 0
  var poscenter = point2D(0, 0)// 缓存双指的中心坐标
  var duration = '' // 设置过渡效果，用于双击缩放效果
  var lastTranslate = point2D(0, 0) // 记录上次的偏移值
  var lastcenter = point2D(el.offsetWidth / 2, el.offsetHeight / 2) // 图像的中心点，用于对比双指中心点
  var center = lastcenter // 初始化为图片中心点
  // 添加缩放事件
  mc.add(new Hammer.Pan({ threshold: 0, pointers: 1 }))
  mc.add(new Hammer.Pinch({ threshold: 0 }))
  mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }))
  mc.on("pinchstart", onPinchStart) // 双指缩放
  mc.on("pinchmove", onPinch) // 双指移动
  mc.on("panmove", onPan)
  mc.on("panstart", onPanStart)
  // 缩放开始
  function onPinchStart (ev) {
    duration = ''
    lastTranslate = point2D(tMatrix[4], tMatrix[5])//记录上一次的偏移值 0 0
    initScale = tMatrix[0] || 1
    // 手势中心点
    poscenter = point2D(ev.center.x, ev.center.y)
    // 图像中心点  = 初始化图像中心点  + 上一次偏移量的中心点
    lastcenter = point2D(center.x + lastTranslate.x, center.y + lastTranslate.y)//重新计算放大后的中心坐标
    // 手势中心点 = 缩放中心点 - 图像中心点
    poscenter = point2D(ev.center.x - lastcenter.x, ev.center.y - lastcenter.y)
    requestElementUpdate('onpinchStart')
  }
  // 缩放途中
  function onPinch (ev) {
    // 缩放倍数 这里的缩放倍数
    nowScale = initScale * ev.scale
    // 如果倍数小于1 则等于1
    if (nowScale < 1) {
      nowScale = 1
    }
    // 缩放倍数
    tMatrix[0] = tMatrix[3] = nowScale
    let x = Number((1 - ev.scale) * poscenter.x + lastTranslate.x)
    let y = Number((1 - ev.scale) * poscenter.y + lastTranslate.y)
    let tempPosX = el.getBoundingClientRect().width / 2 - point2D(el.offsetWidth / 2, el.offsetHeight / 2).x
    let tempPosY = el.getBoundingClientRect().height / 2 - point2D(el.offsetWidth / 2, el.offsetHeight / 2).y
    if (Math.abs(x) > Math.abs(tempPosX)) {
      x = exChangeNum(x, tempPosX)
    }

    if (Math.abs(y) > Math.abs(tempPosY)) {
      y = exChangeNum(y, tempPosY)
    }
    tMatrix[4] = x
    tMatrix[5] = y
    requestElementUpdate('onpinch')
  }
  // 开始拖动
  function onPanStart () {
    lastTranslate = point2D(tMatrix[4], tMatrix[5]) // 缓存上一次的偏移值
  }
  // 拖动过程
  function onPan (ev) {
    tMatrix[0] = tMatrix[3] = nowScale || initScale
    // 拖动的动画 1.6
    duration = '1.6'
    let x = Number(lastTranslate.x + ev.deltaX)
    let y = Number(lastTranslate.y + ev.deltaY)
    let tempPosX = el.getBoundingClientRect().width / 2 - point2D(el.offsetWidth / 2, el.offsetHeight / 2).x
    let tempPosY = el.getBoundingClientRect().height / 2 - point2D(el.offsetWidth / 2, el.offsetHeight / 2).y
    if (Math.abs(x) > Math.abs(tempPosX)) {
      x = exChangeNum(x, tempPosX)
    }
    if (Math.abs(y) > Math.abs(tempPosY)) {
      y = exChangeNum(y, tempPosY)
    }
    tMatrix[4] = x
    tMatrix[5] = y
    requestElementUpdate('onpan')
  }

  // 每次都会·更新 因为是在移动端 所以都采用rem 否则可以直接用matrix
  function updateElementTransform () {
    el.style.transition = duration
    let xRem = Vue.prototype.$pxToRem(tMatrix[4]) + 'rem'
    let yRem = Vue.prototype.$pxToRem(tMatrix[5]) + 'rem'
    el.style.transform = 'translate(' + xRem + ',' + yRem + ') ' + 'scale(' + tMatrix[0] + ',' + tMatrix[3] + ')'
    el.style.WebkitTransform = 'translate(' + xRem + ',' + yRem + ') ' + 'scale(' + tMatrix[0] + ',' + tMatrix[3] + ')'
    el.style.msTransform = 'translate(' + xRem + ',' + yRem + ') ' + 'scale(' + tMatrix[0] + ',' + tMatrix[3] + ')'
    // var tmp = tMatrix.join(',')
    // el.style.transform = 'matrix(' + tmp + ')'
    // el.style.WebkitTransform = 'matrix(' + tmp + ')'
    // el.style.msTransform = 'matrix(' + tmp + ')'
    ticking = false
  }
  function requestElementUpdate () {
    if (!ticking) {
      reqAnimationFrame(updateElementTransform)
      ticking = true
    }
  }
  /**
  初始化设置
  */

  requestElementUpdate()

}

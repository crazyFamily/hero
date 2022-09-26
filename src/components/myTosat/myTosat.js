import Vue from 'vue'
import Toast from './myTosat.vue'
 
let toastVue
 
function createToast() {
  // 这里使用了 VUE 来构建一个 vnode
  // 值得注意的是， $mount() 函数没有填写任何的 dom 节点
  // 这样就变成了一个 未挂载 的 vnode 
  const vnode = new Vue({
    render: h => h(Toast)
  }).$mount()
  // 手动 将 生成的对应 dom 插进 body 里面
  document.body.appendChild(vnode.$el)
  // 返回当前实例  的 vue 对象
  // 没错，就是 $children[0]
  return vnode.$children[0]
}
 
export function showToast(args, callback) {
  // 为了让当前的实例 只有一个，防止占用太多内存
  if (!toastVue) {
    toastVue = createToast()
  }
  toastVue.showToast(args)
  callback && callback()
  return toastVue
}
 
export function hideToast() {
  if (!toastVue) return
  toastVue.hideToast()
  return toastVue
}
 
export function destoryToast() {
  if (!toastVue) return
  toastVue.destory()
}
 
export default showToast
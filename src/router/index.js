import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Load from '../views/load.vue'
import BankList from '../views/BankList.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Load',
    component: Load
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/BankList',
    name: 'BankList',
    component: BankList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/Detail',
    name: 'Detail',
    component: Detail,
    meta: {
      keepAlive: true
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: "",
  routes
})

export default router

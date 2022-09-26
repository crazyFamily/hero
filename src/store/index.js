import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    env:0,
    isInit:-1,// 是否已加载初始化
    initData:[],//初始化线索数据
    isVote:0, // 点亮次数
    activeState:0,// 活动状态
    umDetail:{},
    mapImgobj:null,
    allcity:[
      {imgel:"beicityheb",img:require("@/assets/img/bei_city_heb.png"),ix:4547,iy:578,fx:4534,fy:628,name:"哈尔滨"},// 北区
      {imgel:"beicitycc",img:require("@/assets/img/bei_city_cc.png"),ix:4516,iy:828,fx:4494,fy:877,name:"长春"},
      {imgel:"beicitysy",img:require("@/assets/img/bei_city_sy.png"),ix:4304,iy:972,fx:4280,fy:1020,name:"沈阳"},
      {imgel:"beicitydl",img:require("@/assets/img/bei_city_dl.png"),ix:4313,iy:1182,fx:4277,fy:1231,name:"大连"},
      {imgel:"beicitytj",img:require("@/assets/img/bei_city_tj.png"),ix:3860,iy:1333,fx:3826,fy:1383,name:"天津"},
      {imgel:"beicitybj",img:require("@/assets/img/bei_city_bj.png"),ix:3651,iy:1252,fx:3713,fy:1302,name:"北京"},
      {imgel:"beicityhhht",img:require("@/assets/img/bei_city_hhht.png"),ix:3670,iy:964,fx:3829,fy:1015,name:"呼和浩特"},
      {imgel:"beicitysjz",img:require("@/assets/img/bei_city_sjz.png"),ix:3514,iy:1504,fx:3632,fy:1552,name:"石家庄"},
      {imgel:"beicityty",img:require("@/assets/img/bei_city_ty.png"),ix:3310,iy:1622,fx:3371,fy:1669,name:"太原"},
      {imgel:"beicityzz",img:require("@/assets/img/bei_city_zz.png"),ix:3608,iy:1770,fx:3575,fy:1816,name:"郑州"},
      {imgel:"beicityjn",img:require("@/assets/img/bei_city_jn.png"),ix:3894,iy:1546,fx:3861,fy:1595,name:"济南"},
      {imgel:"beicityqd",img:require("@/assets/img/bei_city_qd.png"),ix:4068,iy:1615,fx:4039,fy:1669,name:"青岛"},
      {imgel:"beicityxa",img:require("@/assets/img/bei_city_xa.png"),ix:3103,iy:1796,fx:3158,fy:1846,name:"西安"},
      {imgel:"beicityyc",img:require("@/assets/img/bei_city_yc.png"),ix:2830,iy:1436,fx:2889,fy:1481,name:"银川"},
      {imgel:"beicitylz",img:require("@/assets/img/bei_city_lz.png"),ix:2687,iy:1636,fx:2651,fy:1686,name:"兰州"},
      {imgel:"beicitywlmq",img:require("@/assets/img/bei_city_wlmq.png"),ix:1656,iy:1060,fx:1651,fy:1120,name:"乌鲁木齐"},//北区
      {imgel:"zcitysz",img:require("@/assets/img/z_city_sz.png"),ix:4131,iy:1773,fx:4101,fy:1821,name:"苏州"},//中区
      {imgel:"zcitynj",img:require("@/assets/img/z_city_nj.png"),ix:4198,iy:1882,fx:4165,fy:1932,name:"南京"},
      {imgel:"zcityxm",img:require("@/assets/img/z_city_xm.png"),ix:4048,iy:2645,fx:4054,fy:2669,name:"厦门"},
      {imgel:"zcityfz",img:require("@/assets/img/z_city_fz.png"),ix:4233,iy:2521,fx:4209,fy:2570,name:"福州"},
      {imgel:"zcityqz",img:require("@/assets/img/z_city_qz.png"),ix:3999,iy:2418,fx:4056,fy:2467,name:"泉州"},
      {imgel:"zcitycd",img:require("@/assets/img/z_city_cd.png"),ix:2641,iy:2153,fx:2604,fy:2204,name:"成都"},
      {imgel:"zcitycq",img:require("@/assets/img/z_city_cq.png"),ix:2987,iy:2247,fx:3024,fy:2290,name:"重庆"},
      {imgel:"zcitycs",img:require("@/assets/img/z_city_cs.png"),ix:3474,iy:2482,fx:3530,fy:2523,name:"长沙"},
      {imgel:"zcitywh",img:require("@/assets/img/z_city_wh.png"),ix:3545,iy:2181,fx:3605,fy:2226,name:"武汉"},
      {imgel:"zcitync",img:require("@/assets/img/z_city_nc.png"),ix:3791,iy:2340,fx:3843,fy:2384,name:"南昌"},
      {imgel:"zcityhf",img:require("@/assets/img/z_city_hf.png"),ix:3976,iy:2038,fx:3951,fy:2087,name:"合肥"},
      {imgel:"zcitywz",img:require("@/assets/img/z_city_wz.png"),ix:4193,iy:2307,fx:4253,fy:2357,name:"温州"},
      {imgel:"zcityhz",img:require("@/assets/img/z_city_hz.png"),ix:4147,iy:2102,fx:4204,fy:2149,name:"杭州"},
      {imgel:"zcitysh",img:require("@/assets/img/z_city_sh.png"),ix:4397,iy:2020,fx:4362,fy:2068,name:"上海"},
      {imgel:"zcitynb",img:require("@/assets/img/z_city_nb.png"),ix:4392,iy:2245,fx:4363,fy:2293,name:"宁波"},//中区
      {imgel:"nancitykm",img:require("@/assets/img/nan_city_km.png"),ix:2569,iy:2741,fx:2621,fy:2789,name:"昆明"},//南区
      {imgel:"nancitygy",img:require("@/assets/img/nan_city_gy.png"),ix:2961,iy:2565,fx:3016,fy:2611,name:"贵阳"},
      {imgel:"nancityhk",img:require("@/assets/img/nan_city_hk.png"),ix:3356,iy:3278,fx:3367,fy:3317,name:"海口"},
      {imgel:"nancityhz",img:require("@/assets/img/nan_city_hz.png"),ix:4007,iy:2811,fx:3972,fy:2860,name:"惠州"},
      {imgel:"nancityzs",img:require("@/assets/img/nan_city_zs.png"),ix:3699,iy:2880,fx:3754,fy:2928,name:"中山"},
      {imgel:"nancitysz",img:require("@/assets/img/nan_city_sz.png"),ix:3877,iy:2723,fx:3844,fy:2768,name:"深圳"},
      {imgel:"nancitydg",img:require("@/assets/img/nan_city_dg.png"),ix:3740,iy:2628,fx:3703,fy:2679,name:"东莞"},
      {imgel:"nancitygz",img:require("@/assets/img/nan_city_gz.png"),ix:3489,iy:2719,fx:3547,fy:2767,name:"广州"},
      {imgel:"nancityfs",img:require("@/assets/img/nan_city_fs.png"),ix:3273,iy:2819,fx:3331,fy:2866,name:"佛山"},
      {imgel:"nancitynn",img:require("@/assets/img/nan_city_nn.png"),ix:3032,iy:2896,fx:3096,fy:2932,name:"南宁"},
      {imgel:"nancityzh",img:require("@/assets/img/nan_city_zh.png"),ix:3447,iy:2942,fx:3499,fy:2994,name:"珠海"}
    ]
  },
  mutations: {
    setinitData (context,obj) {
      context.isInit = 1
      context.initData = obj.banklist;
      context.activeState = obj.status
    },
    setInitDetail(context,obj){
      context.umDetail = obj
    },
    setVote(context,num){
      context.isVote = num
    },
    setmapImgobj(context,obj){
      context.mapImgobj = obj
    }
  },
  actions: {
  },
  modules: {
  }
})

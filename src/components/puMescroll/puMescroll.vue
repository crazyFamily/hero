<template>
  <div class="mescrollBox" >
    <!--mescroll滚动区域的基本结构    -->
    <mescroll-vue
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
      :id="ids"
    >
      <!--内容...-->
      <slot></slot>
    </mescroll-vue>
  </div>
</template>

<script>
// 引入mescroll的vue组件
import MescrollVue from "mescroll.js/mescroll.vue";
export default {
  components: {
    MescrollVue, // 注册mescroll组件
  },
  props: {
    pageSize:{
      default:20,
      type:Number
    },
    ids:{
      default:"mescrollBoxb",
      type:String
    }
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use:false, 
        isLock:true // 锁定下拉刷新
      }, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: {
        auto: false, // 禁止自动加载
        // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
        //以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: this.pageSize, //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- 无更多数据 --</p>',
        noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        lazyLoad: {
          use: true, // 是否开启懒加载,默认false
          attr: 'imgurl'
        },
        empty: {
					warpId: this.ids, //父布局的id (1.3.5版本支持传入dom元素)
					tip: "-- 暂无数据 --" //提示
				}
      }
    };
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll; // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      this.$emit('minit',mescroll);
    },
    upCallback(page, mescroll) {
      // 联网请求
      let obj = {}
      obj.num = page.num;
      obj.mescroll = mescroll
      this.$emit('upfun',obj);
    },
    onbeforeEnter(){
      if (this.mescroll) {
        if (this.mescroll.lastBounce != null) this.mescroll.setBounce(this.mescroll.lastBounce)
        if (this.mescroll.lastScrollTop) {
          this.mescroll.setScrollTop(this.mescroll.lastScrollTop)
        }
      }
    },
    onbeforeLeave(){
      if (this.mescroll) {
        this.mescroll.lastBounce = this.mescroll.optUp.isBounce// 记录当前是否禁止ios回弹
        this.mescroll.setBounce(true) // 允许bounce
        this.mescroll.lastScrollTop = this.mescroll.getScrollTop()// 记录当前滚动条的位置
      }
    }
  },
  mounted(){}
};
</script>

<style scoped lang="scss">
.mescrollBox{
  height: 100%;
  @include borderBox();
}
.con{
  width: 6.94rem;
  margin: 10px auto;
}
</style>
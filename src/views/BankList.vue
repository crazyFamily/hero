<template>
  <div class="prizeCode putCon">
    <div class="fcon" v-show="!isserach">
      <div class="mainCon">
        <div class="itemlist">
            <div class="mainlist">
              <myscroll ref="mychildscroll"  @upfun="onupCallback" @minit="onminit" data-yi="ceshi">
                <div class="item" v-for="(items,index) in datas" :key="index">
                    <div class="rank">{{items.rank}}</div>
                    <div class="name">{{items.name}}</div>
                    <div class="info">{{items.line}}</div>
                    <div class="energy">{{items.energy}}</div>
                    <div class="operation" @click="seeLine(items.clueId)"><img src="@/assets/img/btn2.png" alt=""></div>
                </div>
              </myscroll>
            </div>
        </div>
        <div class="slidetip"><img src="@/assets/img/slide.png" alt=""></div>
        <div class="btnBox">
          <img @click="searchLine" class="searchBtn" src="@/assets/img/sreachbtn.png" alt="">
          <img @click="setLine" class="subBtn" src="@/assets/img/subBtn.png" alt="">
        </div>
        <img @click.stop="closefn" class="close" src="@/assets/img/closebtn.png"/>
        <img class="juanimg" src="@/assets/img/juan2.png" alt="">
      </div>
    </div>
    <!-- 姓名搜索 -->
    <div class="fcon" v-show="isserach">
      <div class="searchCon">
        <img class="stitle" v-if="serachType==2" src="@/assets/img/stitle2.png" alt="">
        <img class="stitle" v-else src="@/assets/img/stitle1.png" alt="">
        <div class="inputDiv">
          <input v-if="serachType==1" type="text" v-model="searchval" placeholder="请输入姓名">
          <input v-else type="text" v-model="searchval2" placeholder="请输入姓名">
          <div class="searchBtn" @click="searchName"></div>
          <div v-if="serachType==2 && serachlist.length>0 && serachSate==1" class="namelist">
            <div @click="goDetail(index)" v-for="(items,index) in serachlist" :key="index" class="nitem">{{items.name}}{{items.umid}}</div>
          </div>
          <div v-if="serachType==2 && (serachSate==2 || serachSate==3)" class="namelist">
            <div style="color:#feeace">{{serachSate==3?'此条线索已提供':"暂无数据"}}</div>
          </div>
        </div>
        <img class="closeBtn" @click="hidesearch" src="@/assets/img/closebtn.png" alt="">
      </div>
    </div>
    <img class="pulogo" src="@/assets/img/logo.png"/>
  </div>
</template>

<script>
import myscroll from "@/components/puMescroll/puMescroll.vue"
export default {
  name: 'BankList',
  components:{
    myscroll
  },
  data() {
    return {
      name:"分行排行1",
      datas:[],
      searchval:"",
      searchval2:"",
      mescrollref:null,
      isserach:false,
      serachType:1,// 1搜索线索，2提供线索
      serachlist:[],
      serachSate:-1,// 姓名检索状态 -- 1：匹配成功；2：匹配不存在；3：该线索已提供
    }
  },
  activated(){
    this.isserach = false
    this.searchval2 = ""
  },
  methods: {
    onminit(me){
      if(!this.mescrollref) this.mescrollref = me;
      this.mescrollref.resetUpScroll();
    },
    onupCallback(obj){
      this.getListDataFromNet(obj.num,obj.mescroll,(arr)=>{
        if (obj.num === 1){ 
          this.datas = []
          this.datas = arr;
        }else{
          this.datas.push(...arr);
        }
        this.searchval = "";
      })
    },
    getListDataFromNet (pageNum,mescroll, successCallback) {
      // 延时一秒, 模拟联网
      let param = new URLSearchParams()
      param.append("name", this.searchval);
      param.append("pageSize", 20);
      param.append("page", pageNum);
      param.append("bankId", this.$route.query.id); // 分行ID
      this.$https.cluelist(param).then(res=>{ 
        let msg = res
        mescroll.endBySize(msg.data.list.length, msg.data.total); 
        if(msg.code==200){
          let newlist = msg.data.list
          successCallback(newlist);
          
        }else{
          this.$ShowToast({
            message: msg.content
          })
        }
      }).catch(() =>{
        mescroll.endErr();
        this.$ShowToast({
          message: "网络不太好，刷新重试!"
        })
      })
      
    },
    closefn(){
      this.$router.push({path: "/Home"})
    },
    searchLine(){
      // 搜索线索按钮
      if(this.$store.state.activeState==1){
        this.isserach = true;
        this.serachType = 1;
      }else if(this.$store.state.activeState==0){
        this.$ShowToast({
          message: "活动未开始!"
        })
      }else if(this.$store.state.activeState==2){
        this.$ShowToast({
          message: "活动已结束!"
        })
      }else{
        this.$ShowToast({
          message: "活动状态异常!"
        })
      }
      
    },
    searchName(){
      if(this.serachType==1){
        // 搜索 -- 列表匹配
        this.isserach = false;
        if(this.mescrollref) this.mescrollref.resetUpScroll();
      }else{
        // 提供 -- 姓名校验
        let param = new URLSearchParams();
        param.append("clueId", this.$route.query.clueId);
        this.$https.checkname(param).then((msg) => {
          if (msg.code == 200) {
            this.serachSate = msg.data.status
            if(msg.data.status==1){
              if(msg.data.list.length>0){
                this.serachlist = msg.data.list
              }
            }else{
              // 线索已提供/不存在
              this.serachSate = msg.data.status
            }
          }else{
            this.$ShowToast({
              message: msg.content,
              showMask: true
            })
          }
        }).catch((err) => {
          if(err.errname && err.errname=="请求超时"){
            this.$ShowToast({
              message: err.content,
              showMask: true
            })
          }
        })
      }
      
    },
    hidesearch(){
      this.isserach = false;
      this.searchval = "";
      this.searchval2 = "";
      this.serachType = 1;
      this.serachlist = [];
      this.serachSate = -1;
    },
    goDetail(index){
      // 选择后
      let sobj = this.serachlist[index];
      this.$store.commit('setInitDetail',sobj);
      this.$router.push({path: "/Detail",query:{type:6,umid:sobj.umid}})
      // 恢复初始状态
      this.isserach = false;
      this.serachlist = [];
      this.searchval2 = "";
      this.serachSate = -1;
      
    },
    setLine(){
      // 提供线索按钮
      if(this.$store.state.activeState==1){
        this.isserach = true;
        this.serachType = 2;
      }else if(this.$store.state.activeState==0){
        this.$ShowToast({
          message: "活动未开始!"
        })
      }else if(this.$store.state.activeState==2){
        this.$ShowToast({
          message: "活动已结束!"
        })
      }else{
        this.$ShowToast({
          message: "活动状态异常!"
        })
      }
    },
    seeLine(clueId){
      // 查看线索
      this.$router.push({path: "/Detail",query:{type:4,clueId:clueId}})
    }
  },
}
</script>

<style scoped lang="scss">
.putCon{
  color:#3c3c3c;
  font-size:0.26rem;
  .fcon{
    display:flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .mainCon{
      width:6.54rem;
      height:11.09rem;
      position: relative;
      background-size:100%;
      background-color: #be9760;
      background: url(~@/assets/img/herobg.png) no-repeat;
      background-size: cover;
      .itemlist{
        width: 5.34rem;
        margin: 0 auto;
      }
      .close{
        width:1.08rem;
        height:1.07rem;
        position:absolute;
        right:-0.4rem;
        top:-0.2rem;
      }
    }
    .slidetip{
      font-size: 0.2rem;
      color: #6a3f1c;
      width: 100%;
      text-align: center;
      padding:0.1rem 0;
      img{
        width: 1.06rem;
      }
    }
    .juanimg{
      width:1.2rem;
      position: absolute;
      right:0.7rem;
      bottom:1.8rem;
      -webkit-animation: flowan 1s linear 0s infinite alternate;
    }
    .btnBox{
      width: 6.06rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1rem;
      margin-left: 0.28rem;
      .searchBtn{
        width: 2.93rem;
      }
      .subBtn{
        width: 2.81rem;
      }
    }
  }
  .itemlist{
    font-size: 0.2rem;
    width: 6rem;
    padding-bottom: 0.15rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-left:0.05rem;
    box-sizing:border-box;
    &>div{
      width: 100%;
    }
    .mainlist{
      flex:1;
      overflow-y: scroll;
      height:6.5rem;
      margin-top: 1.8rem;
    }
    .item{
      display: flex;
      align-items: center;
      padding:0.1rem 0;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      &>div{
        width: 0.92rem;
        flex-shrink:0;
        text-align: center;
      }
      .operation{
        width: 0.9rem;
        text-align: center;
        display: flex;
        align-items: center;
        img{
          width: 0.68rem;
        }
      }
      .info{
        flex:1;
        @include no-wrap();
      }
      .name{
        width: 0.98rem;
        @include no-wrap();
      }
      .energy{
        width: 1.1rem;
      }
    }
    .itemtab{
      color: #fff;
      border:none;
      font-size: 0.27rem;
      font-weight: bold;
      -webkit-text-stroke: 0.02rem #45484a;
      font-family: Fantasy, "Helvetica Neue", Helvetica, sans-serif;
    }
  }
  .searchCon{
    width: 6.18rem;
    height: 3.51rem;
    background: url(~@/assets/img/namebg.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    position: relative;
    .stitle{
      width:2.71rem;
      position: absolute;
      left:50%;
      margin-left: -1.355rem;
      top:-0.45rem
    }
    .inputDiv{
      width: 4.58rem;
      height: 0.9rem;
      background: url(~@/assets/img/inputbg.png) no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      padding-top:0.05rem;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      position: absolute;
      left:0.8rem;
      top:1.3rem;
      input{
        width: 3.62rem;
        height: 0.74rem;
        margin-left: 0.1rem;
        border:none;
        background-color: transparent;
        font-size: 0.36rem;
        color: #3c3c3c;
      }
      .searchBtn{
        width: 0.68rem;
        height: 0.74rem;
      }
      .namelist{
        width: 96%;
        background-color: rgba(255,196,160,0.43);
        position: absolute;
        left:2%;
        top:0.8rem;
        border-bottom-right-radius: 0.04rem;
        border-bottom-left-radius: 0.04rem;
        @include borderBox();
        padding:0.1rem 0.2rem;
        .nitem{
          font-size: 0.22rem;
          color: #feeace;
          border-bottom:0.01rem solid #c1c1c1;
          padding:0.05rem;
        }
        .nitem:last-child{
          border-bottom:none;
        }
      }

    }
    .closeBtn{
      position: absolute;
      width: 0.92rem;
      right:-0.2rem;
      top:-0.25rem
    }
  }
}
</style>
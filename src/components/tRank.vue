<template>
  <div class="tRank putCon" >
    <div class="fcon">
      <div class="mainBG">
        <div class="itemlist">
          <div class="itemtab item">
            <div class="rank"><img class="t_txt1" src="@/assets/img/t_txt1.png"/></div>
            <div class="img"><img class="t_txt2" src="@/assets/img/t_txt2.png"/></div>
            <div class="info"><img class="t_txt3" src="@/assets/img/t_txt3.png"/></div>
            <div class="energy"><img class="t_txt4" src="@/assets/img/t_txt4.png"/></div>
            <div class="operation"><img class="t_txt5" src="@/assets/img/t_txt5.png"/></div>
          </div>
          <div class="mainlist">
            <myscroll ref="mychildscroll" :pageSize="10"  @upfun="onupCallback" @minit="onminit" data-yi="ceshi">
              <div class="item" v-for="(items,index) in datas" :key="index">
                <div class="rank">
                  <img v-if="index==0" src="@/assets/img/rank1.png"/>
                  <img v-else-if="index==1" src="@/assets/img/rank2.png"/>
                  <img v-else-if="index==2" src="@/assets/img/rank3.png"/>
                  <span v-else-if="index<9">0{{index+1}}</span> 
                  <span v-else>{{index+1}}</span> 
                </div>
                <div class="img img2">
                  <img v-if="items.rank==1" class="icon icon1" src="@/assets/img/ricon1.png"/>
                  <img v-else-if="items.rank==2" class="icon icon2" src="@/assets/img/ricon2.png"/>
                  <img v-else-if="items.rank==3" class="icon icon3" src="@/assets/img/ricon3.png"/>
                  <img v-else class="icon icon4" src="@/assets/img/ricon4.png"/>
                  <div class="headimg"><img :src="items.avatar"/></div>
                </div>
                <div class="info">{{items.region}}-{{items.bank}}-{{items.name}}</div>
                <div class="energy">+{{items.energy}}</div>
                <div class="operation" @click="seeLine(items.clueId)"><img src="@/assets/img/btn2.png" alt=""></div>
              </div>
            </myscroll>
          </div>
        </div>
        <div class="slidetip"><img src="@/assets/img/slide2.png" alt=""></div>
        <img @click.stop="closerank" class="backBtn" src="@/assets/img/closebtn.png"/>
        
      </div>
      
    </div>
    <img class="pulogo" src="@/assets/img/logo.png"/>
  </div>
</template>

<script>
import myscroll from "@/components/puMescroll/puMescroll.vue"
export default {
  name: 'tRank',
  components:{
    myscroll
  },
  data() {
    return {
      name:"总排行",
      datas:[],
      mescrollref:null
    }
  },
  methods: {
    closerank(){
      this.$emit('closer')
    },
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
      param.append("pageSize", 10);
      param.append("page", pageNum);
      this.$https.rankList(param).then(res=>{ 
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
    seeLine(clueId){
      // 查看线索
      this.$router.push({path: "/Detail",query:{type:4,clueId:clueId}})
    }
  },
}
</script>

<style scoped lang="scss">
.putCon{
  background: url(~@/assets/img/pbg2.jpg) no-repeat center;
  background-size: cover;
}
.tRank{
  color:#fff;
  font-size:0.26rem;
  .fcon{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .backBtn{
      width: 0.92rem;
      position: absolute;
      right:-0.06rem;
      top:0.82rem
    }
    .mainBG{
      width: 7rem;
      height: 11.60rem;
      background: url(~@/assets/img/top10bg.png) no-repeat center;
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      position: relative;
      .slidetip{
        width: 100%;
        text-align: center;
        padding:0.1rem 0;
        position:absolute;
        left:0;
        bottom:0.45rem;
        img{
          width: 1.06rem;
          pointer-events: none;
        }
      }
    }
  }
  .itemlist{
      font-size: 0.2rem;
      width: 6.27rem;
      height: 8.3rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      background-color: #62748a;
      margin-top: 2.15rem;
      margin-left: 0.15rem;
      padding-bottom:0.6rem;
      &>div{
        width: 100%;
      }
      .mainlist{
        flex:1;
        overflow-y: scroll;
      }
      .item{
          color: #fff;
          display: flex;
          align-items: center;
          margin-top: 0.1rem;
          border-bottom: 0.01rem solid rgba($color: #fff, $alpha: 0.26);
          &>div{
            width: 0.5rem;
            flex-shrink:0;
            text-align: center;
          }
          .rank{
            width: 0.74rem;
            img{
              width: 0.42rem;
            }
          }
          .img{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 0.56rem;
            margin:0 0.15rem;
            .icon{
              width: 0.36rem;
              position: absolute;
              left:50%;
              top:-0.15rem;
              margin-left: -0.18rem;
            }
            .icon1{
              width: 0.36rem;
            }
            .icon3{
              width: 0.35rem;
            }
            .headimg{
              position: absolute;
              left:0.01rem;
              top:0rem;
              width: 0.54rem;
              height: 0.54rem;
              border-radius: 50%;
              background-color: #ded3b7;
            }
          }
          .img2{
            width: 0.56rem;
            height: 0.56rem;
            border:0.02rem solid #fff;
            position: relative;
            border-radius: 50%;
            margin: 0.2rem 0.15rem;
          }
          .info{
              flex:1;
          }
          .energy{
            width: 1.1rem;
          }
          .operation{
            width: 0.9rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            img{
              width: 0.68rem;
            }
            .t_txt5{
              width:0.6rem;
            }
          }
      }
      .itemtab{
        background: rgba($color: #536a87, $alpha: 0.51);
        margin-top: 0;
        height: 0.96rem;
        width: 6.27rem;
        background: url(~@/assets/img/itemTbg.png) no-repeat;
        background-size: 100%;
        border:none;
        &>div{
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .t_txt1{
          width: 0.56rem !important;
        }
        .t_txt2{
          width: 0.6rem;
        }
        .t_txt3{
          width: 2.04rem;
        }
        .t_txt4{
          width: 0.85rem;
        }
        .t_txt5{
          width: 0.6rem;
        }
      }
  }
}
</style>
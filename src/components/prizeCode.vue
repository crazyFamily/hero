<template>
  <div class="prizeCode putCon">
    <div class="fcon">
      <img class="pulogo" src="@/assets/img/logo.png"/>
      <div class="mainCon">
        <img class="icon1" src="@/assets/img/icon1.png"/>
        <div class="itemlist">
          <div v-if="datas.length==0" class="nodata">暂无中奖记录</div>
          <div v-else class="mainlist">
              <div class="item" v-for="(items,index) in datas" :key="index">
                  <div class="img"><img src="@/assets/img/prize0.png"/></div>
                  <div class="info">{{items.name}}</div>
                  <div class="times">{{items.time}}</div>
              </div>
          </div>
        </div>
        <img @click.stop="closefn" class="close" src="@/assets/img/closebtn.png"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tRank',
  data() {
    return {
      name:"中奖记录",
      datas:[]
    }
  },
  mounted() {
    this.initPrize();
  },
  methods: {
    initPrize(){
      console.log("更新中奖数据")
      let params = this.$qs.stringify({});
      this.$https.luckRecord(params).then((msg) => {
        if (msg.code == 200) {
          console.log(msg)
          if(msg.data.list) this.datas = msg.data.list;
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
    },
    closefn(){
      this.$emit('closer')
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
        width:6.13rem;
        height:8.10rem;
        margin-top:3.3rem;
        position: relative;
        background: url(~@/assets/img/prizelistbg.png) no-repeat;
        background-size:100%;
        .icon1{
            width:6rem;
            position:absolute;
            left:50%;
            top:-4.1rem;
            margin-left:-3rem;
            pointer-events: none;
        }
        .itemlist{
          margin-top:1.1rem;
        }
        .close{
            width:1.08rem;
            height:1.07rem;
            position:absolute;
            right:-0.4rem;
            top:-0.2rem;
        }
    }
    
  }
  .itemlist{
    font-size: 0.2rem;
    width: 6rem;
    height: 6.9rem;
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
      margin-top: 0.15rem;
      height:6.9rem;
      margin-left: 0.02rem;
      &>.item:last-child{
        border-bottom:none
      }
    }
    .item{
      display: flex;
      align-items: center;
      margin-top: 0.1rem;
      border-bottom:0.01rem solid #eacdb8;
      padding-bottom:0.15rem;
      &>div{
        width: 1.5rem;
        flex-shrink:0;
        text-align: center;
      }
      .img{
        display: flex;
        align-items: center;
        justify-content: center;
        width:1.3rem;
        img{
            width:0.47rem
        }
      }
      .info{
        flex:1;
      }
      .times{
        width: 2.6rem;
      }
    }
    .itemtab{
      color: red;
    }
  }
}
</style>
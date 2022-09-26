<template>
  <div class="putCon">
    <div class="fcon">
      <img class="pulogo" src="@/assets/img/logo.png"/>
      <div v-show="!iswriteum" :class="['mainCon',imgIndex==0?'mainConno':'']">
        <div class="maintxt" v-if="!isprize">
          <img class="prize_i1" src="@/assets/img/prize_i1.png" alt="">
          <div class="pTitle"><img src="@/assets/img/prize_t1.png" alt=""></div>
          <div class="btnbox">
            <img class="confirmPrize" @click="confirmfn" src="@/assets/img/prize_btn2.png" alt="">
            <img class="canclePrize" @click="closefn" src="@/assets/img/prize_btn1.png" alt="">
          </div>
        </div>
        <div class="maintxt" v-else>
          <img class="prize_i1 prize_ii" src="@/assets/img/prize_i6.png" alt="">
          <div class="pTitle"><img :class="['titlei'+imgIndex]" :src="imgarr[imgIndex].title" alt=""></div>
        </div>
        <img v-if="imgIndex!=-1" class="closeBtn" @click="closeprize" src="@/assets/img/closebtn.png" alt="">
      </div>
      <div v-show="iswriteum" class="umPage">
        <img class="closeBtn2" @click="closefn" src="@/assets/img/closebtn.png" alt="">
        <div class="inputDiv">
          <input type="text" v-model="umcode" placeholder="请输入UM号">
        </div>
        <img class="umbtn1" @click="subcode" src="@/assets/img/btn6.png"/>
        <img class="umbtn2" @click="closefn" src="@/assets/img/btn7.png"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mPrize',
  data() {
    return {
      name:"抽奖相关",
      isprize:false,
      iswriteum:false,
      umcode:"",
      imgarr:[
        {
          title:require("@/assets/img/prize_t0.png") // 谢谢参与
        },
        {
          title:require("@/assets/img/prize_t2.png") //阳光普照奖
        },
        {
          title:require("@/assets/img/prize_t3.png") // 一等奖
        },
        {
          title:require("@/assets/img/prize_t4.png") // 二等奖
        },
        {
          title:require("@/assets/img/prize_t5.png") // 三等奖
        }
      ],
      imgIndex:-1,
      isum:0
    }
  },
  mounted() {
    this.imgIndex = -1
    this.isprize = false;
    this.iswriteum = false;
    this.umcode = "";
    this.isum = 0
  },
  methods: {
    closefn(){
      this.isprize = false;
      this.$emit('closer')
    },
    confirmfn(){
      // 抽奖
      
      let param = new URLSearchParams();
      this.$https.luck(param).then((msg) => {
        if (msg.code == 200) {
          
          this.serachSate = msg.data.status
          this.isum = msg.data.isum
          if(msg.data.status==1){
            // 中奖
            if(msg.data.type==4){
              this.imgIndex = 1
            }else{
              this.imgIndex = Number(msg.data.type)+1
            }
          }else{
            // 未中奖
            this.imgIndex = 0
          }
          this.isprize = true;
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
    subcode(){
      // 提交UM号
      if(!this.umcode){
        this.$ShowToast({
          message: "请先输入UM号",
          showMask: true
        })
        return false;
      }
      let param = new URLSearchParams();
      param.append("umId",this.umcode);
      this.$https.luck(param).then((msg) => {
        if (msg.code == 200) {
          // 提交成功
          this.$ShowToast({
            message: "提交成功",
            showMask: true
          })
          setTimeout(()=>{
            this.isprize = false;
            this.umcode = "";
            this.iswriteum = false;
            this.$emit('closer')
          },500)
          
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
    closeprize(){
      if(this.imgIndex==0){
        this.closefn()
      }else if(this.isum==0){
        this.closefn()
      }else{
        this.iswriteum = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.putCon{
  color:#3c3c3c;
  font-size:0.26rem;
  background: url(~@/assets/img/prizebg.jpg) no-repeat center;
  background-size: cover;
  .fcon{
    display:flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    .mainCon{
      width: 6.59rem;
      height: 10.8rem;
      position: relative;
      .closeBtn{
        position: absolute;
        right:0.7rem;
        top:1.4rem;
        width: 0.86rem;
      }
      .maintxt{
        width: 5.8rem;
        height: 9rem;
        position: absolute;
        left:0.4rem;
        top:1.2rem;
        border-radius: 0.2rem;
        @include borderBox();
        .pTitle{
          width: 100%;
          text-align: center;
          position: absolute;
          left:0;
          top:0.82rem;
          img{
            width: 4.56rem;
          }
          .titlei0{
            width: 3.84rem;
            margin-left: 0.6rem;
          }
          .titlei1{
            width: 3.9rem;
            margin-left: 0.6rem;
          }
          .titlei2{
            width: 2.97rem;
            margin-left: 0.41rem;
          }
          .titlei3{
            width: 3.64rem;
            margin-left: 0.6rem;
          }
          .titlei4{
            width: 3.64rem;
            margin-left: 0.6rem;
          }
        }
        .prize_i1{
          width: 7.5rem;
          position: absolute;
          left:-0.86rem;
          top:0.86rem;
        }
        .prize_ii{
          top:1.5rem;
        }
        .prizei0{
          width: 6.78rem;
          left:-0.3rem;
          top:1.75rem;
        }
        .btnbox{
          width: 90%;
          position: absolute;
          left:5%;
          bottom:1.52rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          img{
            width: 1.7rem;
          }
        }
        .prize_line{
          position: absolute;
          right:0;
          bottom:1.2rem;
          width:5.57rem
        }
        .prize_line2{
          bottom: 2.3rem;
        }
      }
    }
    .umPage{
      width:6.28rem;
      height:3.86rem;
      margin-bottom:0.8rem;
      background: url(~@/assets/img/writeumbg.png) no-repeat center;
      background-size: 100% 100%;
      position:relative;
      .closeBtn2{
        width:1.03rem;
        position:absolute;
        right:-0.1rem;
        top:-0.31rem;
      }
      .inputDiv{
        width:4.42rem;
        height:0.87rem;
        background: url(~@/assets/img/umibg.png) no-repeat center;
        background-size: 100% 100%;
        padding:0.1rem;
        @include borderBox();
        margin:0 auto;
        margin-top:1.9rem;
        input{
          width:100%;
          height:0.6rem;
          border:none;
          background-color:transparent;
          font-size:0.35rem;
          margin-bottom:0.1rem;
        }
      }
      .umbtn1{
        position:absolute;
        width:1.54rem;
        left:1rem;
        bottom:0.05rem;
      }
      .umbtn2{
        position:absolute;
        width:1.54rem;
        right:1rem;
        bottom:0.05rem;
      }
    }
  }
}
</style>
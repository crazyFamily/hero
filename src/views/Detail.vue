<template>
  <div class="Detail pulCon">
    <div class="fcon">
      <div class="logodiv"><img src="@/assets/img/logo.png"/></div>
      <div class="mainCon">
        <img class="closeBtn" @click="backPage" src="@/assets/img/closebtn.png" alt="">
        <img class="dtitle" src="@/assets/img/dtitle.png" alt="">
        <div class="baseinfo">
          <div class="headbg" v-if="!isdedit">
            <div class="imgbgi">
              <img :src="dataobj.avatar" alt="">
            </div>
          </div>
          <div class="headbg" v-else>
            <div class="filebg">
              <img :src="photoIC?photoIC:dataobj.avatar" alt="">
              <input class="flie" ref="inputfile" @change="getFile" type="file" accept="image/*">
              <p class="tipfile">(上传照片)</p>
            </div>
          </div>
          <div class="basetxt">
            <p>姓名：{{dataobj.name}}</p>
            <p>分行：{{dataobj.bank}}</p>
            <p>部门：{{dataobj.department}}</p>
            <p>岗位：{{dataobj.job}}</p>
          </div>
        </div>
        <div class="allItem">
          <!-- 所获荣誉 -->
          <div class="infoItem">
            <div class="iTitle"><span>所获荣誉</span></div>
            <div class="iItem">
              <div class="ctitleDiv"><div class="contitle">*预入围英雄荟奖项</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" v-model="dataobj.honor_1" name="honor1" v-bind:readonly="!isdedit" ></textarea>
                <span class="txtLen">{{txtlen(dataobj.honor_1)}}/100</span>
              </div>
            </div>
            <div class="iItem margintop20">
              <div class="ctitleDiv"><div class="contitle">*近三年个人/团队所获主要荣誉(3项)</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" v-model="dataobj.honor_2" v-bind:readonly="!isdedit" name="honor2"></textarea>
                <span class="txtLen">{{txtlen(dataobj.honor_2)}}/100</span>
              </div>
            </div>
          </div>
          <!-- 技能优势 -->
          <div class="infoItem">
            <div class="iTitle"><span>技能优势</span></div>
            <div class="iItem">
              <div class="ctitleDiv"><div class="contitle">*列举1-3项个人优势方向及理由</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" name="honor1" v-bind:readonly="!isdedit" v-model="dataobj.skill_1"></textarea>
                <span class="txtLen">{{txtlen(dataobj.skill_1)}}/100</span>
              </div>
            </div>
          </div>
          <!-- 案例线索 -->
          <div class="infoItem">
            <div class="iTitle"><span>案例线索</span></div>
            <div class="iItem iIteminput">
              <input type="text" maxlength="12" v-bind:readonly="!isdedit" v-model="dataobj.practicename" placeholder="请输入案例名称">
            </div>
            <div class="iItem">
              <div class="ctitleDiv"><div class="contitle">*案例背景</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" name="line1" v-bind:readonly="!isdedit" v-model="dataobj.practice_1"></textarea>
                <span class="txtLen">{{txtlen(dataobj.practice_1)}}/100</span>
              </div>
            </div>
            <div class="iItem">
              <div class="ctitleDiv"><div class="contitle">*困难挑战</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" name="line2" v-bind:readonly="!isdedit" v-model="dataobj.practice_2"></textarea>
                <span class="txtLen">{{txtlen(dataobj.practice_2)}}/100</span>
              </div>
            </div>
            <div class="iItem">
              <div class="ctitleDiv"><div class="contitle">*关键措施</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" name="line3" v-bind:readonly="!isdedit" v-model="dataobj.practice_3"></textarea>
                <span class="txtLen">{{txtlen(dataobj.practice_3)}}/100</span>
              </div>
            </div>
            <div class="iItem">
              <div class="ctitleDiv"><div class="contitle">*收获结果</div></div>
              <div class="areaTxt">
                <textarea maxlength="100" name="line4" v-bind:readonly="!isdedit" v-model="dataobj.practice_4"></textarea>
                <span class="txtLen">{{txtlen(dataobj.practice_4)}}/100</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottomBg">
          <!-- 点亮线索 -->
          <img v-if="!isdedit" @click="votefn" class="voteBtn" src="@/assets/img/btn0.png" alt="">
          <!-- 提供线索 -->
          <img v-else class="subBtn" @click="confirmfn" src="@/assets/img/btn1.png" alt="">
        </div>
      </div>
    </div>
    <!-- 点亮成功 -->
    <div class="popup2" v-show="successLight">
      <div :class="['maskcon',successLightan?'popup-on':'']">
        <div class="ancon pan">
          <img class="energyadd" src="@/assets/img/energyadd.png" alt="">
          <img class="closeBtn" @click="toprize" src="@/assets/img/closebtn.png" alt="">
        </div>
      </div>
    </div>
    <!-- 提交成功和失败 -->
    <div class="popup2" v-show="subMask">
      <!-- 提交确认框 -->
      <div v-show="step==1" :class="['maskcon',subMaskan?'popup-on':'']">
        <div class="confirmCon pan">
          <p>提交后，则不允许修改</p>
          <p>提交成功后，此条线索不能提交</p>
          <img class="confrimBtn" @click="subline" src="@/assets/img/btn5.png" alt="">
          <img class="closeBtn" @click="closeMask" src="@/assets/img/closebtn.png" alt="">
        </div>
      </div>
      <!-- 提交成功和失败 -->
      <div v-show="step==2" :class="['maskcon',subMaskan?'popup-on':'']">
        <div class="ancon pan ancon2">
          <img v-if="subStatus==200" class="substatus" src="@/assets/img/btn3.png" alt="">
          <img v-else class="substatus" src="@/assets/img/btn4.png" alt="">
          <img class="closeBtn" @click="backIndex" src="@/assets/img/closebtn.png" alt="">
        </div>
      </div>
    </div>
    <m-prize @closer="closeprize" v-if="hasprize"></m-prize>
  </div>
</template>

<script>
import { testSize } from '@/common/common.js'
import mPrize from "@/components/mPrize";
import {Mphoto} from "../common/mphoto.js"
export default {
  name: 'Detail',
  components:{
    mPrize
  },
  data() {
    return {
      name:"线索详情",
      isdedit:true,
      datas:[],
      photoIC:"",
      dataobj:{},
      hasprize:false,
      successLight:false,
      successLightan:false,
      subStatus:200,//提交线索状态 200成功 -1失败
      subMask:false,
      subMaskan:false,
      step:1,
      cphoto:"",
      isclick:false
    }
  },
  computed:{
    txtlen(){
      return function (data) {
        if(data){
          return data.length
        }else{
          return 0
        }
      }
    }
  },
  mounted() {
    // this.initDetail();
  },
  activated(){
    this.initDetail();
    this.photoIC = "";
    this.isclick = false
    if(this.$route.query.type && this.$route.query.type==6){
      this.isdedit = true;
      let $that = this;
      this.cphoto = new Mphoto();
      this.cphoto.funconfirm = function(msg){
        $that.photoIC = msg.img;
      }
    }else{
      this.isdedit = false;
    }
  },
  methods: {
    initDetail(){
      console.log("获取线索数据")
      if(this.$route.query.type==6){
        if(this.$store.state.umDetail.umid){
          this.dataobj = this.$store.state.umDetail
        } else{
          this.$router.go(-1)
        }
        
      }else{
        let param = new URLSearchParams();
        param.append("clueId", this.$route.query.clueId);
        this.$https.clueDetail(param).then((msg) => {
          if (msg.code == 200) {
            console.log(msg)
            if(msg.data) this.dataobj = msg.data;
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
    backPage(){
      this.$router.go(-1);
    },
    getFile(e){
      // 获取文件
      testSize(e,this).then((res)=>{
        // this.photoIC = res
        this.cphoto.imgurl = res;
        this.cphoto.cutW = 500;
        this.cphoto.cutH = 500;
        this.cphoto.$init();
        this.$refs.inputfile.value = ""
      })
    },
    votefn(){
      if(this.$store.state.activeState==0){
        this.$ShowToast({
          message: "活动未开始!"
        })
        return false
      }else if(this.$store.state.activeState==2){
        this.$ShowToast({
          message: "活动已结束!"
        })
        return false
      }
      // 点亮线索
      if(!this.isclick){
        this.isclick = true;
        let nowvote = this.$store.state.isVote
        if(nowvote<1){
          this.$ShowToast({
            message: "今日点亮次数已用完"
          })
          return false
        }
        let param = new URLSearchParams();
        param.append("clueId", this.$route.query.clueId);
        this.$https.vote(param).then((msg) => {
          this.isclick = false
          if (msg.code == 200) {
            // msg.data.status  1 点亮成功 0 点亮失败(失败扣不扣点亮次数)
            console.log(msg)
            if(msg.data.status==1){
              nowvote--;
              this.$store.commit('setVote',nowvote)
              this.successLight = true
              setTimeout(()=>{
                this.successLightan = true;
              },10)

            }else{
              this.$ShowToast({
                message: msg.data.content
              })
            }
            
          }else{
            this.$ShowToast({
              message: msg.content,
              showMask: true
            })
          }
        }).catch((err) => {
          this.isclick = false
          if(err.errname && err.errname=="请求超时"){
            this.$ShowToast({
              message: err.content,
              showMask: true
            })
          }
        })
      }else{
        console.log("请勿重复点击")
      }
      
    },
    confirmfn(){
      // 询问是否提交线索
      if(!this.dataobj.honor_1 || !this.dataobj.honor_2 || !this.dataobj.skill_1 || !this.dataobj.practice_1 || !this.dataobj.practice_2 || !this.dataobj.practice_3 || !this.dataobj.practice_4){
        this.$ShowToast({
          message: "请把信息填写完整!",
          showMask: true
        })
        return false;
      }
      this.subMask = true;
      this.step = 1
      setTimeout(()=>{
        this.subMaskan = true
      },100)
    },
    subline(){
      // 提交线索
      if(!this.isclick){
        this.isclick = true;
        let param = new URLSearchParams();
        param.append("umid", this.dataobj.umid);
        param.append("honor_1", this.dataobj.honor_1);
        param.append("honor_2", this.dataobj.honor_2);
        param.append("skill_1", this.dataobj.skill_1);
        if(this.$store.state.env==1){
          param.append("avatar", this.photoIC?this.photoIC:this.dataobj.avatar);
        }
        // param.append("avatar", this.photoIC?this.photoIC:this.dataobj.avatar);
        param.append("practice_1", this.dataobj.practice_1);
        param.append("practice_2", this.dataobj.practice_2);
        param.append("practice_3", this.dataobj.practice_3);
        param.append("practice_4", this.dataobj.practice_4);
        this.$https.createClue(param).then((msg) => {
          this.isclick = false
          if (msg.code == 200) {
            console.log(msg)
            if(msg.data.status==1){
              this.step = 2
              this.subStatus = 200
              this.subMask = true;
              this.subMaskan = false;
              setTimeout(()=>{
                this.subMaskan = true
              },10)
            }else{
              this.subStatus = -1
              this.$ShowToast({
                message: msg.data.content
              })
            }
            
          }else{
            this.$ShowToast({
              message: msg.content,
              showMask: true
            })
          }
        }).catch((err) => {
          this.isclick = false
          if(err.errname && err.errname=="请求超时"){
            this.$ShowToast({
              message: err.content,
              showMask: true
            })
          }
        })
      }else{
        console.log("请勿重复点击")
      }

      
    },
    toprize(){
      //获得抽奖机会
      this.successLight = false;
      this.successLightan = false;
      this.subMask = false;
      this.subMaskan = false;
      this.hasprize = true;
    },
    closeMask(){
      this.subMask = false;
      this.subMaskan = false;
    },
    closeprize(){
      this.hasprize = false;
      this.$router.push({path: "/Home"})
      // this.$router.go(-1); // 返回上一页（英雄榜）
    },
    backIndex(){
      this.successLight = false;
      this.successLightan = false;
      this.subMask = false;
      this.subMaskan = false;
      this.$router.push({path: "/Home"})
    }
  },
}
</script>

<style scoped lang="scss">
.logodiv{
  width: 100%;
  img{
    width: 2.81rem;
    margin-left: 0.33rem;
    margin-top: 0.71rem;
  }
}
.fcon{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  .mainCon{
    width: 6.71rem;
    min-height: 6rem;
    background: url(~@/assets/img/detailbg_top.png) no-repeat;
    background-size: 100% auto;
    margin: 0 auto;
    margin-top:1rem;
    position: relative;
    margin-bottom: 1.8rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    .closeBtn{
      width: 0.92rem;
      position: absolute;
      right:-0.3rem;
      top:0;
    }
    .allItem{
      width: 100%;
      background: url(~@/assets/img/repeatbg.png) repeat center top;
      background-size: 100% auto;
    }
    .bottomBg{
      width: 100%;
      height: 1.68rem;
      background: url(~@/assets/img/detailbg_b.png) no-repeat;
      background-size: 100% 100%;
      position: relative;
      .voteBtn{
        width: 3.13rem;
        position: absolute;
        left:50%;
        margin-left: -1.565rem;
        bottom:-0.5rem;
      }
      .subBtn{
        width: 3.13rem;
        position: absolute;
        left:50%;
        margin-left: -1.565rem;
        bottom:-0.5rem;
      }
    }
    &>div{
      flex-shrink:0;
    }
    .dtitle{
      width: 4.44rem;
      position: absolute;
      left:50%;
      top:-0.43rem;
      margin-left: -2.22rem;
    }
    .baseinfo{
      width: 4.84rem;
      height: 2.34rem;
      background: url(~@/assets/img/infobg.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 1.67rem;
      display: flex;
      align-items: center;
      padding:0.1rem;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      .headbg{
        flex-shrink: 0;
        width: 1.31rem;
        height: 1.31rem;
        margin-right: 0.2rem;
        margin-left: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url(~@/assets/img/headbg.png) no-repeat;
        background-size: 100% 100%;
        .imgbgi{
          width: 1.23rem;
          height: 1.2rem;
          overflow: hidden;
          background-color: #996f37;
          img{
            width: 100%;
          }
        }
        .filebg{
          width: 1.23rem;
          height: 1.2rem;
          background: url(~@/assets/img/imgadd.png) no-repeat;
          background-size: 100% 100%;
          position: absolute;
          .flie{
            opacity: 0.01;
            width: 100%;
            height: 100%;
            border:none;
            background-color: transparent;
            position: absolute;
            left:0;
            top:0;
          }
          img{
            width: 100%;
          }
          .tipfile{
            width: 100%;
            text-align: center;
            color: #857d7d;
            font-size: 0.16rem;
            position: absolute;
            left:0;
            bottom:-0.4rem;
          }
        }
      }
      .basetxt{
        flex:1;
        height: 90%;
        display: flex;
        flex-direction: column;
        justify-content:space-evenly;
        font-size: 0.23rem;
        color: #292218;
        font-weight: bold;
      }
    }
    .infoItem{
      width: 5.45rem;
      margin: 0 auto;
      margin-top: 0.32rem;
      margin-bottom: 0.1rem;
      .iTitle{
        width: 1.62rem;
        height: 0.82rem;
        position: relative;
        background: url(~@/assets/img/projectbg.png) no-repeat;
        background-size: 100% 100%;
        span{
          display: inline-block;
          width:1.33rem;
          height: 0.46rem;
          text-align: center;
          font-size: 0.25rem;
          color: #fff;
          font-weight: bold;
          line-height: 0.46rem;
          position: absolute;
          left:0.2rem;
          top:0.08rem;
        }
      }
      .ctitleDiv{
        width: 100%;
        text-align: center;
        .contitle{
          position: relative;
          font-size: 0.22rem;
          color: #000;
          padding:0 0.22rem;
          display: inline-block;
          &::before{
            content: "";
            display: inline-block;
            width: 0.31rem;
            height: 0.18rem;
            background: url(~@/assets/img/title_deco_left.png) no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left:0;
            bottom:-0.05rem;
          }
          &::after{
            content: "";
            display: inline-block;
            width: 0.31rem;
            height: 0.18rem;
            background: url(~@/assets/img/title_deco_right.png) no-repeat;
            background-size: 100% 100%;
            position: absolute;
            position: absolute;
            right:-0.05rem;
            bottom:-0.05rem;
          }
        }
      }
      .areaTxt{
        width: 4.17rem;
        height: 1.53rem;
        border:0.01rem solid #6a430e;
        background-color: #c09c6c;
        border-radius: 0.06rem;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding:0.2rem;
        margin: 0 auto;
        margin-top:0.1rem;
        position: relative;
        textarea{
          width: 100%;
          height: 100%;
          color: #272727;
          font-size: 0.2rem;
          border:none;
          outline: none;
          background-color: transparent;
        }
        .txtLen{
          position: absolute;
          display: inline-block;
          right:0.1rem;
          bottom:0rem;
          font-size: 0.16rem;
          color:#d8c5a7
        }
      }
      .iIteminput{
        width: 3.31rem;
        height: 0.39rem;
        background: url(~@/assets/img/inputbg2.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.1rem auto;
        input{
          width: 3rem;
          height: 0.32rem;
          border:none;
          background-color: transparent;
          font-size: 0.2rem;
          text-align: center;
          color: #6c1518;
        }
      }
      
    }
  }
}
.maskcon{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .ancon{
    position: relative;
    margin-bottom: 1.3rem;
    opacity:0;
    -webkit-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0s;
    -webkit-transform: translateY(30px);
  }
  .ancon2{
    margin-bottom: 0.5rem;
    .closeBtn{
      top:-0.31rem;
      right: -0.28rem;
    }
  }
  .confirmCon{
    width: 4.16rem;
    height: 2.39rem;
    background: url(~@/assets/img/subbg.png) no-repeat;
    background-size: 100% auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity:0;
    -webkit-transition: all 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) 0s;
    -webkit-transform: translateY(30px);
    margin-bottom: 0.5rem;
    p{
      color: #685230;
      font-size: 0.2rem;
    }
    .confrimBtn{
      width: 1.29rem;
      height: 0.49rem;
      position: absolute;
      left:50%;
      bottom:-0.1rem;
      margin-left:-0.645rem;
    }
    .closeBtn{
      top:-0.2rem;
      right:-0.2rem
    }
  }
  .energyadd{
    width: 5.04rem;
  }
  .substatus{
    width: 3.47rem;
  }
  .closeBtn{
    position: absolute;
    right: 0.3rem;
    top:2rem;
    width: 0.92rem;
  }
}
.popup-on{
  .pan{
    opacity:1;
    -webkit-transform: none;
  }
}
</style>
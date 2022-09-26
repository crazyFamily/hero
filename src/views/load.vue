<template>
  <div id="wrapper">
    <!-- <div id="js_loading" class="loading"><div></div></div> -->
    <div id="page_loading2" v-show="!isloadend">
      <div class="progressDiv">
        <img class="fireimg" src="@/assets/img/loadicon0.png"/>
        <div :style="{'width':progress+'%'}" class="nowprogress"></div>
        <div class="loadtxt">loading...{{this.progress}}%</div>
      </div>
      <div class="loadroate"></div>
      <!-- {{this.progress}} -->
      <p id="loadNum">加载中</p>
    </div>
    <div v-show="isloadend" class="page page-on">
      <div class="cover" >
        <img class="lbtn8" @click="toHome" src="@/assets/img/btn8.png" alt="">
      </div>
    </div>
    <img class="pulogo" src="@/assets/img/logo.png"/> 
  </div>
</template>

<script>
export default {
  name: 'Load',
  data() {
    return {
      loadImgArr: [
        {id:"p1bg",src:require("@/assets/img/p1-bg.jpg")},
        {id:"mapbg",src:require("@/assets/img/map1.png")},
        {id:"areabei",src:require("@/assets/img/area_bei.png")},
        {id:"areanan",src:require("@/assets/img/area_nan.png")},
        {id:"areazhong",src:require("@/assets/img/area_zhong.png")},
        {id:"fire1",src:require("@/assets/img/fire0.png")},
        {id:"fire2",src:require("@/assets/img/fire1.png")},
        {id:"fire3",src:require("@/assets/img/fire2.png")},
        {id:"fire4",src:require("@/assets/img/fire3.png")},
        {id:"fire5",src:require("@/assets/img/fire4.png")},
        {id:"star",src:require("@/assets/img/star.png")},
        {id:"energyadd",src:require("@/assets/img/energyadd.png")},
        {id:"btn3",src:require("@/assets/img/btn3.png")},
        {id:"btn2",src:require("@/assets/img/btn2.png")},
        {id:"detailbg_top",src:require("@/assets/img/detailbg_top.png")},
        {id:"detailbg_b",src:require("@/assets/img/detailbg_b.png")},
        {id:"detailbg",src:require("@/assets/img/detailbg.png")},
        {id:"herobg",src:require("@/assets/img/herobg.png")},
        {id:"juanan",src:require("@/assets/img/juanan.png")},
        {id:"namebg",src:require("@/assets/img/namebg.png")},
        {id:"infobg",src:require("@/assets/img/infobg.png")},
        {id:"repeatbg",src:require("@/assets/img/repeatbg.png")},
        {id:"stitle1",src:require("@/assets/img/stitle1.png")},
        {id:"stitle2",src:require("@/assets/img/stitle2.png")},
        {id:"top10bg",src:require("@/assets/img/top10bg.png")},
        {id:"Pindexbg",src:require('@/assets/img/Pindexbg.jpg')}
        
      ],
      loadImgArrback:[
        {id:"prize_i0",src:require("@/assets/img/prize_i0.png")},
        {id:"prize_i1",src:require("@/assets/img/prize_i1.png")},
        {id:"prize_i6",src:require("@/assets/img/prize_i6.png")},
        {id:"prize_t0",src:require("@/assets/img/prize_t0.png")},
        {id:"prize_t1",src:require("@/assets/img/prize_t1.png")},
        {id:"prize_t2",src:require("@/assets/img/prize_t2.png")},
        {id:"prize_t3",src:require("@/assets/img/prize_t3.png")},
        {id:"prize_t4",src:require("@/assets/img/prize_t4.png")},
        {id:"prize_t5",src:require("@/assets/img/prize_t5.png")}
      ],
      imageElArr:{},
      imgCount: 0,
      progress: 0,
      isloadend:false,
      cdn:"",
      isshowRank:false,
      ranklist:[],
      isshowPrize:false,
      initCity:[],
      stratJuan:false
    }
  },
  methods:{
    loadImg() {
      for(let item of this.$store.state.allcity){
        let obj = {}
        obj.id = item.imgel;
        obj.src = item.img;
        this.loadImgArr.push(obj);
      }
      for (let item of this.loadImgArr) {
        let image = new Image()
        image.src = this.cdn+item.src;
        image.onload = () => {
          this.imgCount++;
          this.progress = parseInt(
            (this.imgCount / this.loadImgArr.length) * 100
          )
          this.imageElArr[item.id] = image;
          if (this.imgCount === this.loadImgArr.length) {
            console.log("加载完成")
            this.isloadend = true;
            this.loadImgafter()
            this.$store.commit('setmapImgobj',this.imageElArr)
            // this.$router.replace("/Home")
          }
        }
      }
    },
    loadImgafter(){
      for (let item of this.loadImgArrback) {
        let image = new Image()
        image.src = this.cdn+item.src;
        image.onload = () => {}
      }
    },
    toHome(){
      this.$router.replace("/Home")
    }
  },
  mounted() {
    if(!this.isloadend){
      setTimeout(()=>{
        this.loadImg();
      },10)
    }
  }
}
</script>

<style scoped lang="scss">
.cover{
  width:100%;
  height:100%;
  background: url(~@/assets/img/Pindexbg.jpg) no-repeat center;
  background-size: cover;
}
.lbtn8{
  width: 4.74rem;
  position: absolute;
  left:50%;
  bottom:0.4rem;
  margin-left: -2.37rem;
}
</style>

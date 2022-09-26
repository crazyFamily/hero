<template>
  <div id="wrapper">
    <!--首页-->
    <div id="p1" class="page page-on">
        <div class="puCon">
            <canvas ref="mapcanvas" id="mapcanvas"></canvas>
            <!-- 标题 -->
            <img class="pulogo" src="@/assets/img/logo.png"/>
            <!-- 新探攻略 排行榜 抽奖记录 -->
            <div class="tabBox">
              <div class="tabTop">
                <div class="tabTitem" @click="tabIdfn(1)">
                  <img v-if="tabId==1" src="@/assets/img/index_t_btn11.png"/>
                  <img v-else src="@/assets/img/index_t_btn10.png"/>
                </div>
                <div class="tabTitem" @click="tabIdfn(3)">
                  <img v-if="tabId==3" src="@/assets/img/index_t_btn31.png"/>
                  <img v-else src="@/assets/img/index_t_btn30.png"/>
                </div>
                <div class="tabTitem" @click="tabIdfn(2)">
                  <img v-if="tabId==2" src="@/assets/img/index_t_btn21.png"/>
                  <img v-else src="@/assets/img/index_t_btn20.png"/>
                </div>
              </div>
              <div class="tabMain">
                <div class="tabMitem" v-if="tabId==1">
                  <div class="tm_title"><img class="tab_title1" src="@/assets/img/tab_title1.png"/></div>
                  <div class="tm_con tm_con1">
                    <div class="tm_ctitle">内容</div>
                    <div class="tm_cmain">内容内容内容内容内容内容内容内容内容内容内容内容</div>
                  </div>
                </div>
                <div class="tabMitem" v-else-if="tabId==2">
                  <div class="tm_title"><img class="tab_title2" src="@/assets/img/tab_title2.png"/></div>
                  <div class="tm_con tm_con2">
                    <div class="tm_ctitle tm_ctitle2">
                      <div class="img"><img class="tab2name1" src="@/assets/img/tab2name1.png"/></div>
                      <div class="info"><img class="tab2name2" src="@/assets/img/tab2name2.png"/></div>
                      <div class="times"><img class="tab2name3" src="@/assets/img/tab2name3.png"/></div>
                    </div>
                    <div class="prizelist">
                      <div v-if="prizeList.length==0" class="nodata">-- 暂无中奖记录 ---</div>
                      <div v-else class="pmainlist">
                          <div class="item" v-for="(items,index) in prizeList" :key="index">
                              <div class="img"><img src="@/assets/img/prize0.png"/></div>
                              <div class="info">{{items.name}}</div>
                              <div class="times">{{items.time}}</div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tabMitem tabMitem3" v-else>
                  <img class="tab_title3" src="@/assets/img/tab_title3.png"/>
                  <div class="tm_con tm_con3">
                    <div class="itemlist">
                      <div class="itemtab item">
                        <div class="rank"><img class="t_txt1" src="@/assets/img/t_txt1.png"/></div>
                        <div class="img"><img class="t_txt2" src="@/assets/img/t_txt2.png"/></div>
                        <div class="info"><img class="t_txt3" src="@/assets/img/t_txt3.png"/></div>
                        <div class="energy"><img class="t_txt4" src="@/assets/img/t_txt4.png"/></div>
                        <div class="operation"><img class="t_txt5" src="@/assets/img/t_txt5.png"/></div>
                      </div>
                      <div class="mainlist">
                        <div class="scrolllist" ref="scrolllist">
                          <div class="item" v-for="items in ranklist" :key="items.index">
                            <div class="rank">
                              <img v-if="items.rank==1" src="@/assets/img/rank1.png"/>
                              <img v-else-if="items.rank==2" src="@/assets/img/rank2.png"/>
                              <img v-else-if="items.rank==3" src="@/assets/img/rank3.png"/>
                              <span v-else-if="items.rank<10">0{{items.rank}}</span> 
                              <span v-else>{{items.rank}}</span> 
                            </div>
                            <div class="img">
                              <div class="img2">
                                <img v-if="items.rank==1" class="icon icon1" src="@/assets/img/ricon1.png"/>
                                <img v-else-if="items.rank==2" class="icon icon2" src="@/assets/img/ricon2.png"/>
                                <img v-else-if="items.rank==3" class="icon icon3" src="@/assets/img/ricon3.png"/>
                                <img v-else class="icon icon4" src="@/assets/img/ricon4.png"/>
                                <div class="headimg"><img :src="items.avatar"/></div>
                              </div>
                            </div>
                            <!-- -{{items.name}} -->
                            <div class="info">{{items.region}}-{{items.bank}}</div>
                            <div class="energy">+{{items.energy}}</div>
                            <div class="operation" ><img @click="seeLine(items.clueId)" src="@/assets/img/btn2.png" alt=""></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="morerankdiv"><img @click="showRank" class="morerank" src="@/assets/img/moreBtn.png"/></div>
                </div>
              </div>
            </div>
            <!-- 卷轴动画 -->
            <img ref="juanel" :class="['indexjuanan',stratJuan?'inflowan':'']" src="@/assets/img/juanan.png"/>
        </div>
    </div>
    <t-rank v-if="isshowRank" @closer="hideRank"></t-rank>
    <prize-code v-if="isshowPrize" @closer="hidePrize"></prize-code>
  </div>
</template>

<script>
import createjs from 'createjs'
import Hammer from 'hammerjs'
import tRank from "@/components/tRank";
import prizeCode from "@/components/prizeCode";
export default {
  name: 'Home',
  components:{
    tRank,
    prizeCode
  },
  data() {
    return {
      imageElArr:{},
      isshowRank:false,
      ranklist:[],
      isshowPrize:false,
      initCity:[],
      stratJuan:false,
      timer0:null,
      timer1:null,
      timer2:null,
      isScroll:false,
      step:0,
      tabId:3,
      prizeList:[]
    }
  },
  methods:{
    hitArea(o,scale2){
      //设置感应区域
      let scale=scale2||1;
      var bounds=o.getBounds();
      var hitArea=new createjs.Shape();
      hitArea.graphics.f('#f00').dr(0,0,bounds.width,bounds.height);
      var cx=bounds.width/2,cy=bounds.height/2;
      hitArea.set({scaleX:scale,scaleY:scale,regX:cx,regY:cy,x:cx+bounds.x,y:cy+bounds.y});
      o.hitArea=hitArea;
    },
    initmap(){
      let _this = this;
      var mapcanvas = this.$refs.mapcanvas;
      let winH = document.documentElement.clientHeight*3;
      let winW = document.documentElement.clientWidth*3;
      // let cW = 5080,wscale = winH/winW,cH = 3737;
      let cW = 5080,cH = 3737;
      /* let tH = cH;
      let tW = cW; */
      let wscale = winW/cW
      mapcanvas.width = winW;
      mapcanvas.height = winH; //tH;
      console.log(wscale)
      let stage = new createjs.Stage(mapcanvas);
      stage.removeAllChildren();
      createjs.Touch.enable(stage);

      /* var ographics = new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, winW, winH);
      var obShape = new createjs.Shape(ographics);
      obShape.alpha = 0.5
      stage.addChild(obShape) */
      
      // 整体
      let mainCon = new createjs.Container()
      mainCon.setBounds(0,0,cW,cH)
      mainCon.set({x:winW/2,regX:cW/2,y:winH/3.5,regY:cH/2,scaleY:wscale,scaleX:wscale})
      stage.addChild(mainCon)
      let oyinhua = mainCon;
      
      // 地图
      let mapbg = new createjs.Bitmap(_this.imageElArr.mapbg);
      var mscale = 5080/3251
      mapbg.set({scaleY:mscale,scaleX:mscale})
      mainCon.addChild(mapbg);
      // 星星
      let ostar = new createjs.Bitmap(_this.imageElArr.star)
      ostar.set({x:3495,y:2418})
      mainCon.addChild(ostar);
      // 三区旗子
      let areaNan = new createjs.Bitmap(_this.imageElArr.areabei);
      areaNan.set({x:3066,y:1060})
      let areaBei = new createjs.Bitmap(_this.imageElArr.areanan);
      areaBei.set({x:3115,y:2352})
      let areaZhong = new createjs.Bitmap(_this.imageElArr.areazhong);
      areaZhong.set({x:3355,y:1899})
      mainCon.addChild(areaNan,areaBei,areaZhong)
      
      for (let i = 0; i < _this.initCity.length; i++) {
        for(let item of _this.$store.state.allcity){
          if(_this.initCity[i].mapname==item.name){
            createcity(item,_this.initCity[i].level,_this.initCity[i].id)
          }
        }
      }
      stage.update();

      function createcity(obj,level,guid){
       /* obj = {imgel,ix,iy,cityname,fx,fy} */
        let nlevel = level || 1
        let ocityCon = new createjs.Container();
        ocityCon.name = obj.name;
        ocityCon.guid = guid;
        let imgkey = obj.imgel;
        // 城市名称
        let ocity = new createjs.Bitmap(_this.imageElArr[imgkey]);
        ocity.set({x:obj.ix,y:obj.iy})
        // 烽火台
        let ofire = new createjs.Bitmap(_this.imageElArr["fire"+nlevel]);
        let fscale = 78/103
        ofire.set({x:obj.fx,y:obj.fy,scaleY:fscale,scaleX:fscale})
        ocityCon.addChild(ofire,ocity)
        _this.hitArea(ocityCon)
        mainCon.addChild(ocityCon)
        ocityCon.on('click',(e)=>{
          // 点击烽火台
          _this.stratJuan = true;
          _this.$refs.juanel.addEventListener('webkitAnimationEnd', ()=>{
            // console.log("动画结束")
            _this.$router.push({path: "/BankList",query:{id:e.currentTarget.guid,name:e.currentTarget.name}})
            _this.stratJuan = false;
          });
          /* _this.$ShowToast({
            message: "点击"+e.currentTarget.name
          }) */
          // 
        })
      }

      // 缩放操作
      // this.scalefn()
      var opmc_x=0,opmc_y=0,opmc_scale=0,pratio=0;
      var opmc = null;
      opmc = new Hammer.Manager(mapcanvas);
      opmc.add(new Hammer.Pan());
      opmc.add(new Hammer.Pinch());
      opmc.add(new Hammer.Tap());
      
      opmc.on('pinchstart panstart', function () {
          if (!oyinhua) return;
          console.log("pinchstart--")
          pratio=cW/cH //winW/winH //cW/cH; // 
          console.log("pratio--"+pratio)
          oyinhua.i_x = oyinhua.x;
          oyinhua.i_y = oyinhua.y;
          oyinhua.i_scale = oyinhua.scaleX;
          opmc_x=0;
          opmc_y=0;
          opmc_scale=1;
      });
      opmc.on('pinchmove panmove', function (e) {
          if (!oyinhua) return;
          //缩放
          var pminScale = wscale,
              pmaxScale = 2;
          var s = oyinhua.i_scale + (e.scale-opmc_scale);
          if(s>=pminScale&&s<=pmaxScale){
              oyinhua.scaleX = oyinhua.scaleY = s;
          }else{
              opmc_scale=e.scale;
              if (s < pminScale){
                oyinhua.scaleX = oyinhua.scaleY=oyinhua.i_scale=pminScale;
              }else if(s>pmaxScale){
                oyinhua.scaleX = oyinhua.scaleY=oyinhua.i_scale=pmaxScale;
              }
          }
          // oyinhua.rotation = oyinhua.i_rotation + e.rotation;
        
          //移动
          var x=oyinhua.i_x + (e.deltaX-opmc_x)/wscale*pratio,
              y=oyinhua.i_y + (e.deltaY-opmc_y)/wscale*pratio;
          oyinhua.x=x;
          oyinhua.y=y;
          stage.update();
      });

      
    },
    initRank(){
      console.log("获取排行榜数据")
      let params = new URLSearchParams()
      params.append("pageSize", 10);
      params.append("page", 1);
      this.$https.rankList(params).then((msg) => {
        if (msg.code == 200) {
          console.log(msg)
          if(msg.data.list) this.ranklist = msg.data.list;
          /* if(!this.isScroll){
            this.rankscroll();
          }
          this.isScroll = true */
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
    showRank(){
      this.isshowRank = true;
    },
    hideRank(){
      this.initRank();
      this.isshowRank = false;
    },
    hidePrize(){
      this.isshowPrize = false;
    },
    rankscroll(){
      clearTimeout()
      this.timer0 = setTimeout(() => {
        let scrolllistel = document.getElementsByClassName('scrolllist')[0];
        this.replatescroll(scrolllistel)
      }, 2000);
    },
    replatescroll(el){
      let firstelH = el.firstChild.offsetHeight;
      el.style.marginTop = -firstelH+'px';
      el.style.webkitTransition = "all 0.5s linear 0s";
      this.timer2 = setTimeout(()=>{
        let firstel = el.firstChild;
        el.removeChild(el.firstChild)
        el.appendChild(firstel)
        el.style.webkitTransition = "all 0s linear 0s"
        el.style.marginTop = 0+'px';
        if(this.timer2) clearInterval(this.timer2)
        setTimeout(()=>{
          this.replatescroll(el);
        },2000)
      },510)
    },
    initPrize(){
      console.log("更新中奖记录")
      let params = this.$qs.stringify({});
      this.$https.luckRecord(params).then((msg) => {
        if (msg.code == 200) {
          console.log(msg)
          if(msg.data.list) this.prizeList = msg.data.list;
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
    tabIdfn(type){
      this.tabId = type
      if(type==2){
        // 抽奖记录
        this.initPrize()
      }else if(type==3){
        // 排行榜
        this.initRank()
      }
    },
    seeLine(clueId){
      // 查看线索
      this.$router.push({path: "/Detail",query:{type:4,clueId:clueId}})
    }
  },
  activated() {
    if(this.$store.state.mapImgobj){
      this.initRank();
    }
    // this.initPrize()
  },
  mounted() {
    console.log("mounted");
    this.step = 1
    this.initCity = this.$store.state.initData
    if(this.$store.state.mapImgobj){
      this.imageElArr = this.$store.state.mapImgobj;
      this.initmap()
    }else{
      this.$router.replace("/")
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/index.scss";
</style>

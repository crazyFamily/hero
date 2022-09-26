import Hammer from "hammerjs"
import createjs from 'createjs'
import EXIF from 'exif-js'
export function Mphoto(){
  this.stageW = 750;
  this.stageH = 0;
  this.pcanvas = document.createElement('canvas');
  this.pcanvas.className = "photoCanvas"
  this.pcanvas.style.cssText = "width:100%;position:fixed;left:0px;top:0px;background-color:rgba(0,0,0,0.6)"
  this.pstage =  new createjs.Stage(this.pcanvas);
  createjs.Touch.enable(this.pstage);

  this.cutW = 500;
  this.cutH = 600;
  this.cutX = 0;
  this.cutY = 0;
  this.cutBox = null; // 裁剪部分容器
  this.photoBox = null; // 图片容器
  this.imgurl = "";
  this.oimg = null;

  this.funcancle = function(){};
  this.funconfirm = function(){};
  this.baseImg = "ceshi"

  this.$control()
}
Mphoto.prototype.$init = function(){
  this.pstage.removeAllChildren();
  this.stageH = document.documentElement.clientHeight*(this.stageW/document.documentElement.clientWidth);
  this.pcanvas.width = this.stageW;
  this.pcanvas.height = this.stageH;
  this.photoBox = new createjs.Container();
  this.cutBox = new createjs.Container();
  this.pstage.addChild(this.photoBox,this.cutBox);
  this.cutX = (this.stageW-this.cutW)/2;
  this.cutY = (this.stageH-this.cutH)/2;
  // 图片大小位置蒙版
  let cutmask = new createjs.Shape();
  cutmask.graphics.beginStroke("#fff").setStrokeStyle(1).beginFill("rgba(0,0,0,0)").drawRect(this.cutX, this.cutY, this.cutW, this.cutH);
  this.cutBox.addChild(cutmask);
  // 取消、确认按钮
  let btncancle = new createjs.Text("取消", "35px Arial", "#fff")
  btncancle.x = 80;
  btncancle.y = this.stageH-80;
  btncancle.mouseEnabled = true;
  this.$hitArea(btncancle,1.2);
  btncancle.on('click',this.$cancle,this,true);

  let btnconfirm = new createjs.Text("确认", "35px Arial", "#fff")
  let boundwh2 = btnconfirm.getBounds()
  btnconfirm.x = this.stageW-80-boundwh2.width;
  btnconfirm.y = this.stageH-80;
  btnconfirm.mouseEnabled = false;
  this.$hitArea(btnconfirm,1.2);
  btnconfirm.on('click',this.$complete,this,true);

  this.pstage.addChild(btncancle,btnconfirm);
  this.pstage.update();
  document.body.append(this.pcanvas)

  let $that = this;
  this.$cameraposition(this.imgurl,function(cimg){
    $that.$createPhoto(cimg)
    btnconfirm.mouseEnabled=true;
  })

}
/**图片初始位置 */
Mphoto.prototype.$createPhoto = function(img){
  this.photoBox.removeAllChildren();
  this.oimg = new createjs.Bitmap(img);
  this.oimg.regX = img.width/2;
  this.oimg.regY = img.height/2;
  this.oimg.x = this.stageW/2;
  this.oimg.y = this.stageH/2;
  if(this.oimg.image.width/this.oimg.image.height>this.cutW/this.cutH){
    this.oimg.scaleX=this.oimg.scaleY=this.cutH/this.oimg.image.height;
  }else{
    this.oimg.scaleX=this.oimg.scaleY=this.cutW/this.oimg.image.width;
  }
  this.oimg.minScale = this.oimg.scaleX
  this.oimg.maxScale = this.oimg.scaleX*3
  this.photoBox.addChild(this.oimg);
  this.pstage.update();
}
/**取消 */
Mphoto.prototype.$cancle = function(){
  this.pcanvas.remove();
  this.funcancle();
}
/**完成 */
Mphoto.prototype.$complete = function(){
  this.photoBox.cache(this.cutX,this.cutY,this.cutW,this.cutH);
  this.baseImg = this.photoBox.cacheCanvas.toDataURL("image/png",0.8)
  this.photoBox.uncache();
  this.funconfirm({img:this.baseImg});
  this.pcanvas.remove();
}
/**扩大点击区域 */
Mphoto.prototype.$hitArea = function(oel,bscale){
  let scale=bscale||1;
  let bounds=oel.getBounds();
  let hitArea=new createjs.Shape();
  hitArea.graphics.beginFill('#000').drawRect(0,0,bounds.width,bounds.height);
  let cx=bounds.width/2,cy=bounds.height/2;
  hitArea.set({scaleX:scale,scaleY:scale,regX:cx,regY:cy,x:cx+bounds.x,y:cy+bounds.y});
  oel.hitArea=hitArea;
}
/**拍照位置调整 */
Mphoto.prototype.$cameraposition = function(imgfile,callback){
  console.log("cameraposition111")
  let pimg = new Image();
  let _orientation = 1;// 1--正方向0° 6-顺时针90° 8-逆时针90°  3-180°
  pimg.onload = ()=>{
    console.log("cameraposition22")
    EXIF.getData(pimg, function(){
      _orientation = EXIF.getTag(this, 'Orientation');
      loadend()
    });
  }
  pimg.src = imgfile;
  let $that = this
  function loadend(){
    console.log("_orientation--"+_orientation)
    let rotation=0,ratio=1,changeW,changeH,oscale=1;
    changeW = pimg.width;
    changeH = pimg.height;
    // if(navigator.userAgent.match(/iphone/i)){}
    if(_orientation != "" && _orientation != 1){ 
      switch(_orientation){ 
        case 6:
          changeW = pimg.height;
          changeH = pimg.width;
          rotation = 270;
          break; 
        case 8:
          changeW = pimg.height;
          changeH = pimg.width;
          rotation = 90;
          break; 
        case 3:
          changeW = pimg.height;
          changeH = pimg.width;
          rotation = 180;
          break; 
      }     
    }
    ratio = changeW/changeH;
    console.log("cameraposition3332")
    if(ratio>1){// 横长图
      if(changeW>$that.stageW){
        oscale=$that.stageW/changeW;
        changeW=$that.stageW;
        changeH=changeW/ratio;
      }
    }else{ // 竖长图
      let maxh = $that.stageH/2
      if(changeH>maxh){
        oscale=maxh/changeH;
        changeH=maxh;
        changeW=changeH*ratio;
      }
    }
    let canvas=document.createElement('canvas');
    canvas.width=changeW;
    canvas.height=changeH;
    let stage=new createjs.Stage(canvas);
    let o=new createjs.Bitmap(pimg);
    o.regX=o.image.width/2;
    o.regY=o.image.height/2;
    o.x=changeW/2;
    o.y=changeH/2;
    o.scaleX=o.scaleY=oscale;
    o.rotation=rotation;
    stage.addChild(o);
    stage.update();
    if(callback) callback(canvas);
  }

}
/**控制 */
Mphoto.prototype.$control = function(){
  console.log("controlsss")
  let $that = this;
  let _mc = new Hammer.Manager(this.pcanvas);
  _mc.add(new Hammer.Pinch());
  _mc.add(new Hammer.Pan());
  _mc.add(new Hammer.Rotate());
  let sx,sy,sscale,screenratio;
  _mc.on('pinchstart panstart rotatestart',function(){
    if(!$that.oimg) return;
    screenratio = $that.pcanvas.width/$that.pcanvas.clientWidth
    $that.oimg.old_x = $that.oimg.x;
    $that.oimg.old_y = $that.oimg.y;
    $that.oimg.old_scale = $that.oimg.scaleX;
    sx = 0;
    sy = 0;
    sscale = 1;
  })
  _mc.on('pinchmove panmove rotatemove',function(ev){
    if(!$that.oimg) return;
    //缩放
    let minScale=$that.oimg.minScale,maxScale=$that.oimg.maxScale;
    let m_s = $that.oimg.old_scale + (ev.scale-sscale)
    if(m_s>=minScale&&m_s<=maxScale){
      $that.oimg.scaleX = $that.oimg.scaleY = m_s;
    }else{
      sscale=ev.scale;
      if (m_s < minScale){
        $that.oimg.scaleX = $that.oimg.scaleY=$that.oimg.old_scale=minScale;
      }else if(m_s>maxScale){
        $that.oimg.scaleX = $that.oimg.scaleY=$that.oimg.old_scale=maxScale;
      }
    }
    let ow = $that.oimg.image.width*$that.oimg.scaleX,
        oh = $that.oimg.image.height*$that.oimg.scaleX;
    // 边界
    let omaxY = $that.cutY,
        omaxX = $that.cutX,
        ominY = $that.cutY-(oh-$that.cutH),
        ominX = $that.cutX-(ow-$that.cutW);
    let ox = $that.oimg.old_x + (ev.deltaX-sx)*screenratio,
        oy = $that.oimg.old_y + (ev.deltaY-sy)*screenratio;
    let x0 = ox-ow/2,y0 = oy-oh/2;// 图片坐标转为左上角坐标
    // x坐标边界处理
    if(x0>=ominX&&x0<=omaxX){
      $that.oimg.x = ox
    }else{
      sx=ev.deltaX;
      if(x0<ominX){
        $that.oimg.x=$that.oimg.old_x=ominX+ow/2;
      }else if(x0>omaxX){
        $that.oimg.x=$that.oimg.old_x=omaxX+ow/2;
      }
    }
    //y坐标边界处理
    if(y0>=ominY&&y0<=omaxY){
      $that.oimg.y=oy;
    }else{
      sy=ev.deltaY;
      if(y0<ominY){
        $that.oimg.y=$that.oimg.old_y=ominY+oh/2;
      }else if(y0>omaxY){
        $that.oimg.y=$that.oimg.old_y=omaxY+oh/2;
      }
    }
    $that.pstage.update()
  })
}
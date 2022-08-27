/*! 一叶孤舟 | qq:28701884 | 欢迎指教 */

var com = com || {};

com.init = function (stype) {

  com.nowStype = stype || "stype2";
  var stype = com.stype[com.nowStype];
  com.width = stype.width;  //画布宽度
  com.height = stype.height;   //画布高度
  com.spaceX = stype.spaceX;  //着点X跨度
  com.spaceY = stype.spaceY;  //着点Y跨度
  com.pointStartX = stype.pointStartX; //第一个着点X坐标;
  com.pointStartY = stype.pointStartY; //第一个着点Y坐标;
  com.page = stype.page;   //图片目录

  com.canvas = jLibr.getEle("chess"); //画布
  com.ct = com.canvas.getContext("2d");
  com.canvas.width = com.width;
  com.canvas.height = com.height;
  com.loadImages(com.page);//载入图片/图片目录
}

//样式
com.stype = {
  stype1: {
    width: 325,  //画布宽度
    height: 402,   //画布高度
    spaceX: 35,  //着点X跨度
    spaceY: 36,  //着点Y跨度
    pointStartX: 5,  //第一个着点X坐标;
    pointStartY: 19,  //第一个着点Y坐标;
    page: "stype_1" //图片目录
  },
  stype2: {
    width: 523,  //画布宽度
    height: 580,   //画布高度
    spaceX: 57,  //着点X跨度
    spaceY: 57,  //着点Y跨度
    pointStartX: 3,  //第一个着点X坐标;
    pointStartY: 5,  //第一个着点Y坐标;
    page: "stype_2" //图片目录
  },
  stype3: {
    width: 530,  //画布宽度
    height: 567,   //画布高度
    spaceX: 57,  //着点X跨度
    spaceY: 57,  //着点Y跨度
    pointStartX: -2,  //第一个着点X坐标;
    pointStartY: 0,  //第一个着点Y坐标;
    page: "stype_3" //图片目录
  }
}

ChessImages = {}

//载入图片
com.loadImages = function (stype) {

  //绘制棋盘
  ChessImages.bgImg = new Image();
  ChessImages.bgImg.src = "img/" + stype + "/bg.png";

  //提示点
  ChessImages.dotImg = new Image();
  ChessImages.dotImg.src = "img/" + stype + "/dot.png";

  //棋子
  for (var i in XiangqiRules.piecesHash) {
    ChessImages[i] = {};
    ChessImages[i].img = new Image();
    ChessImages[i].img.src = "img/" + stype + "/" + XiangqiRules.piecesHash[i].img + ".png";
  }

  //棋子外框
  ChessImages.paneImg = new Image();
  ChessImages.paneImg.src = "img/" + stype + "/r_box.png";

  document.body.style.background = "url(img/" + stype + "/bg.jpg)";

}

//显示列表
com.show = function () {
  com.ct.clearRect(0, 0, com.width, com.height);
  com.bg.show();
  com.dot.show();
  com.pane.show();

  for(let row = 0; row < play.map.length; row++){
    for(let col = 0; col < play.map[row].length; col++){
      let key = play.map[row][col];
      if(key){
        let piece = new XiangqiPiece(key, row, col);
        piece.isShow = true;
        piece.show();
      }
    }
  }
}

//显示移动的棋子外框
com.showPane = function (x, y, newX, newY) {
  com.pane.isShow = true;
  com.pane.x = x;
  com.pane.y = y;
  com.pane.newX = newX;
  com.pane.newY = newY;
}

//获取元素距离页面左侧的距离
com.getDomXY = function (dom) {
  var left = dom.offsetLeft;
  var top = dom.offsetTop;
  var current = dom.offsetParent;
  while (current !== null) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return { x: left, y: top };
}

com.class = com.class || {} //类
com.class.Bg = function (img, x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.isShow = true;

  this.show = function () {
    if (this.isShow) com.ct.drawImage(ChessImages.bgImg, com.spaceX * this.x, com.spaceY * this.y);
  }
}
com.class.Pane = function (img, x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.newX = x || 0;
  this.newY = y || 0;
  this.isShow = true;

  this.show = function () {
    if (this.isShow) {
      com.ct.drawImage(ChessImages.paneImg, com.spaceX * this.x + com.pointStartX, com.spaceY * this.y + com.pointStartY)
      com.ct.drawImage(ChessImages.paneImg, com.spaceX * this.newX + com.pointStartX, com.spaceY * this.newY + com.pointStartY)
    }
  }
}

com.class.Dot = function (img, x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.isShow = true;
  this.dots = []

  this.show = function () {
    this.dots.forEach((dot) => {
      if (this.isShow) {
        com.ct.drawImage(ChessImages.dotImg, com.spaceX * dot[0] + 10 + com.pointStartX, com.spaceY * dot[1] + 10 + com.pointStartY)
      }
    })
  }
}


window.onload = function () {
  com.bg = new com.class.Bg();
  com.dot = new com.class.Dot();
  com.pane = new com.class.Pane();
  com.pane.isShow = false;

  com.mans = {};  //棋子集合

  //开始对弈
  jLibr.getEle("playBtn").addEventListener("click", function (e) {
    play.isPlay = true;
    var depth = parseInt(jLibr.getDepth(), 10) || 3;

    play.init(depth, play.initMap);
    jLibr.getEle("chessBox").style.display = "block";
    jLibr.getEle("menuBox").style.display = "none";
  })

  //开始挑战
  jLibr.getEle("clasliBtn").addEventListener("click", function (e) {
    play.isPlay = true;
    var clasli = parseInt(jLibr.getClasli(), 10) || 0;
    play.init(4, com.clasli[clasli].map);
    jLibr.getEle("chessBox").style.display = "block";
    jLibr.getEle("menuBox").style.display = "none";
  })

  // 悔棋
  jLibr.getEle("regretBtn").addEventListener("click", function (e) {
    play.regret();
  })

  //返回首页
  jLibr.getEle("gohomeBtn").addEventListener("click", function (e) {
    jLibr.getEle("chessBox").style.display = "none";
    jLibr.getEle("menuBox").style.display = "block";
    jLibr.getEle("indexBox").style.display = "block";
    jLibr.getEle("menuQj").style.display = "none";
    jLibr.getEle("menuDy").style.display = "none";
  })

  //返回
  jLibr.getEle("menuFh").addEventListener("click", function (e) {
    jLibr.getEle("indexBox").style.display = "block";
    jLibr.getEle("menuQj").style.display = "none";
    jLibr.getEle("menuDy").style.display = "none";
  })

  //返回关闭
  jLibr.getEle("menuGb").addEventListener("click", function (e) {
    jLibr.getEle("indexBox").style.display = "block";
    jLibr.getEle("menuQj").style.display = "none";
    jLibr.getEle("menuDy").style.display = "none";
  })

  //重新开始棋局
  jLibr.getEle("restartBtn").addEventListener("click", function (e) {
    if (confirm("是否确定要重新开始？")) {
      play.isPlay = true;
      play.init(4, play.mapBackup);
    }
  })

  //人机对弈
  jLibr.getEle("indexDy").addEventListener("click", function (e) {
    jLibr.getEle("indexBox").style.display = "none";
    jLibr.getEle("menuQj").style.display = "none";
    jLibr.getEle("menuDy").style.display = "block";
  })

  //挑战棋局
  jLibr.getEle("indexQj").addEventListener("click", function (e) {
    jLibr.getEle("indexBox").style.display = "none";
    jLibr.getEle("menuQj").style.display = "block";
    jLibr.getEle("menuDy").style.display = "none";
  })

  //换肤
  jLibr.getEle("stypeBtn").addEventListener("click", function (e) {
    var stype = com.nowStype;
    if (stype == "stype3") stype = "stype2";
    else if (stype == "stype2") stype = "stype1";
    else if (stype == "stype1") stype = "stype3";
    com.init(stype);
    com.show();

    document.cookie = "stype=" + stype;
    clearInterval(timer);
    var i = 0;
    var timer = setInterval(function () {
      com.show();
      if (i++ >= 5) clearInterval(timer);
    }, 2000);
  })
}

com.init();


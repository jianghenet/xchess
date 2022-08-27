/*! 一叶孤舟 | qq:28701884 | 欢迎指教 */

var play = play || {};

play.init = function (depth, map) {
  var depth = depth || 3
  play.my = 1;  //玩家方
  play.mapBackup = DeepClone(map);
  play.map = DeepClone(map); //初始化棋盘
  play.nowManKey = false;  //现在要操作的棋子
  play.pace = [];  //记录每一步
  play.isPlay = true;  //是否能走棋

  play.isOffensive = true;  //是否先手
  play.depth = depth;  //搜索深度

  com.pane.isShow = false;  //隐藏方块
  com.bg.show();
  com.show();

  //绑定点击事件
  com.canvas.addEventListener("click", play.clickCanvas);
}


play.initMap = [
  ['C0', 'M0', 'X0', 'S0', 'J0', 'S1', 'X1', 'M1', 'C1',],
  [, , , , , , , , ,],
  [, 'P0', , , , , , 'P1', ,],
  ['Z0', , 'Z1', , 'Z2', , 'Z3', , 'Z4',],
  [, , , , , , , , ,],
  [, , , , , , , , ,],
  ['z0', , 'z1', , 'z2', , 'z3', , 'z4',],
  [, 'p0', , , , , , 'p1', ,],
  [, , , , , , , , ,],
  ['c0', 'm0', 'x0', 's0', 'j0', 's1', 'x1', 'm1', 'c1',]
];

//悔棋
play.regret = function () {
  var map = DeepClone(play.initMap);
  var pace = play.pace;
  pace.pop();
  pace.pop();

  for (var i = 0; i < pace.length; i++) {
    var p = pace[i].split("")
    var x = parseInt(p[0], 10);
    var y = parseInt(p[1], 10);
    var newX = parseInt(p[2], 10);
    var newY = parseInt(p[3], 10);
    var key = map[y][x];
    map[newY][newX] = key;
    map[y][x] = null;
    if (i == pace.length - 1) {
      com.showPane(newX, newY, x, y)
    }
  }
  play.map = map;
  play.my = 1;
  play.isPlay = true;
  com.show();
}

//点击棋盘事件
play.clickCanvas = function (e) {
  if (!play.isPlay) return false;
  var key = play.getClickMan(e);
  var point = play.getClickPoint(e);

  var x = point.x;
  var y = point.y;
  if (key) {
    play.manualClickMan(key, x, y);
  } else {
    //点击到棋盘空白着点
    let rowcol = XiangqiTeller.getRowCol(play.map, play.nowManKey)
    if(rowcol){
      play.manualClickPoint(play.nowManKey, rowcol.col, rowcol.row, x, y);
    }

  }
}

//点击棋子，两种情况，选中或者吃子
play.manualClickMan = function (key, newX, newY) {
  if (play.nowManKey && play.nowManKey != key && XiangqiTeller.getPiceColor(play.nowManKey) != XiangqiTeller.getPiceColor(key)) {
    //吃子
    let rowcol = XiangqiTeller.getRowCol(play.map, play.nowManKey);
    play.manualCapture(play.nowManKey, rowcol.col, rowcol.row, key, newX, newY);
  } else {// 选中棋子
    play.manualPickup(key, newX, newY);
  }
}

play.manualPickup = (key, newX, newY) =>{
  let piece = new XiangqiPiece(key, newY, newX);
  if (piece.isRed()) {
    com.pane.isShow = false;
    play.nowManKey = key;
    com.dot.dots = piece.getWays(play.map);
    com.show();
    jLibr.getEle("selectAudio").play();
  }

}

play.manualCapture = (attackerKey, oldX, oldY, targetKey, newX, newY) => {
  let attacker = new XiangqiPiece(attackerKey, oldY, oldX);

  //man为被吃掉的棋子
  if (attacker.isInDots(play.map, newX, newY)) {
    var pace = oldX + "" + oldY + newX + newY;
    play.pace.push(pace);

    play.map[oldY][oldX] = null;
    play.map[newY][newX] = play.nowManKey;
    com.showPane(oldX, oldY, newX, newY);

    play.nowManKey = false;
    com.pane.isShow = false;
    com.dot.dots = [];
    com.show();
    jLibr.getEle("clickAudio").play();
    setTimeout(play.AIPlay, 500);
    if (targetKey == "j0") play.showWin(-1);
    if (targetKey == "J0") play.showWin(1);
  }
}

//点击着点
play.manualClickPoint = function (attackerKey, oldX, oldY, newX, newY) {
  if (attackerKey) {
    let piece = new XiangqiPiece(attackerKey, oldY, oldX);
    if (piece.isInDots(play.map, newX, newY)) {
      var pace = oldX + "" + oldY + newX + newY;
      play.map[oldY][oldX] = null;
      play.map[newY][newX] = attackerKey;
      com.showPane(oldX, oldY, newX, newY);
      play.pace.push(pace);
      play.nowManKey = null;
      com.dot.dots = [];
      com.show();
      jLibr.getEle("clickAudio").play();
      setTimeout(play.AIPlay, 500);
    }
  }
}

//Ai自动走棋
play.AIPlay = function () {
  //return
  play.my = -1;
  var pace = AI.getGoodMove();
  if (!pace) {
    play.showWin(1);
    return;
  }
  play.pace.push(pace.join(""));
  var attacker = play.map[pace[1]][pace[0]];
  var targetKey = play.map[pace[3]][pace[2]];
  if (targetKey) {
    play.AIclickMan(attacker, pace[0], pace[1], targetKey, pace[2], pace[3]);
  } else {
    play.AIclickPoint(attacker, pace[0], pace[1], pace[2], pace[3]);
  }
  jLibr.getEle("clickAudio").play();
}

//吃子
play.AIclickMan = function (attacker, oldX, oldY, target, newX, newY) {
  play.map[oldY][oldX] = null;
  play.map[newY][newX] = attacker;
  com.showPane(oldX, oldY, newX, newY);
  play.nowManKey = false;
  com.show()
  if (target == "j0") play.showWin(-1);
  if (target == "J0") play.showWin(1);
}


play.AIclickPoint = (key, oldX, oldY, newX, newY) => {
  play.map[oldY][oldX] = null;
  play.map[newY][newX] = key;
  com.showPane(oldX, oldY, newX, newY);
  play.nowManKey = false;
  com.show();
}

//获得点击的着点
play.getClickPoint = function (e) {
  var domXY = com.getDomXY(com.canvas);
  var x = Math.round((e.pageX - domXY.x - com.pointStartX - 20) / com.spaceX)
  var y = Math.round((e.pageY - domXY.y - com.pointStartY - 20) / com.spaceY)
  return { "x": x, "y": y }
}

//获得棋子
play.getClickMan = function (e) {
  var clickXY = play.getClickPoint(e);
  var x = clickXY.x;
  var y = clickXY.y;
  if (x < 0 || x > 8 || y < 0 || y > 9) return false;
  return (play.map[y][x] && play.map[y][x] != "0") ? play.map[y][x] : false;
}

play.showWin = function (my) {
  play.isPlay = false;
  if (my === 1) {
    Talice.speakWin();
    alert("恭喜你，你赢了！");
  } else {
    alert("很遗憾，你输了！");
  }
}


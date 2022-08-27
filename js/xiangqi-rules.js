
XiangqiRules = {
}

//棋子配置
XiangqiRules.piecesHash = {
  //红子 中文/图片地址/阵营/权重
  'c': { label: "车", img: 'r_c', color: 1, wayId: "c", valueId: "c" },
  'm': { label: "马", img: 'r_m', color: 1, wayId: "m", valueId: "m" },
  'x': { label: "相", img: 'r_x', color: 1, wayId: "x", valueId: "x" },
  's': { label: "仕", img: 'r_s', color: 1, wayId: "s", valueId: "s" },
  'j': { label: "将", img: 'r_j', color: 1, wayId: "j", valueId: "j" },
  'p': { label: "炮", img: 'r_p', color: 1, wayId: "p", valueId: "p" },
  'z': { label: "兵", img: 'r_z', color: 1, wayId: "z", valueId: "z" },

  //黑子
  'C': { label: "车", img: 'b_c', color: -1, wayId: "c", valueId: "C" },
  'M': { label: "马", img: 'b_m', color: -1, wayId: "m", valueId: "M" },
  'X': { label: "象", img: 'b_x', color: -1, wayId: "x", valueId: "X" },
  'S': { label: "士", img: 'b_s', color: -1, wayId: "s", valueId: "S" },
  'J': { label: "帅", img: 'b_j', color: -1, wayId: "j", valueId: "J" },
  'P': { label: "炮", img: 'b_p', color: -1, wayId: "p", valueId: "P" },
  'Z': { label: "卒", img: 'b_z', color: -1, wayId: "z", valueId: "Z" }
};

/**大写为黑，小写为红方*/
XiangqiRules.piecesSets = {
  "c0": "c", "c1": "c",
  "m0": "m", "m1": "m",
  "x0": "x", "x1": "x",
  "s0": "s", "s1": "s",
  "j0": "j",
  "p0": "p", "p1": "p",
  "z0": "z", "z1": "z", "z2": "z", "z3": "z", "z4": "z", "z5": "z",

  "C0": "C", "C1": "C",
  "M0": "M", "M1": "M",
  "X0": "X", "X1": "X",
  "S0": "S", "S1": "S",
  "J0": "J",
  "P0": "P", "P1": "P",
  "Z0": "Z", "Z1": "Z", "Z2": "Z", "Z3": "Z", "Z4": "Z", "Z5": "Z",
}

XiangqiRules.piecesBoard = (()=>{
  let pboard = {};
  for(id in XiangqiRules.piecesSets){
    pboard[id] = XiangqiRules.piecesHash[XiangqiRules.piecesSets[id]];
  }
  return pboard;
})();

//棋子能走的着点,走法
XiangqiRules.ways = {}
//车，无论横线、竖线均可行走，只要无子阻拦，步数不受限制。行进方向棋子不是己方棋子，可以吃子。
XiangqiRules.ways.c = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  //左侧检索
  for (var i = x - 1; i >= 0; i--) {
    if (map[y][i]) {
      if (XiangqiTeller.getPiceColor(map[y][i]) != piece.color) d.push([i, y]);
      break
    } else {
      d.push([i, y])
    }
  }
  //右侧检索
  for (var i = x + 1; i <= 8; i++) {
    if (map[y][i]) {
      if (XiangqiTeller.getPiceColor(map[y][i]) != piece.color) d.push([i, y]);
      break
    } else {
      d.push([i, y])
    }
  }
  //上检索
  for (var i = y - 1; i >= 0; i--) {
    if (map[i][x]) {
      if (XiangqiTeller.getPiceColor(map[i][x]) != piece.color) d.push([x, i]);
      break
    } else {
      d.push([x, i])
    }
  }
  //下检索
  for (var i = y + 1; i <= 9; i++) {
    if (map[i][x]) {
      if (XiangqiTeller.getPiceColor(map[i][x]) != piece.color) d.push([x, i]);
      break
    } else {
      d.push([x, i])
    }
  }
  return d;
}

//马，马走日;马一次可走的选择点可以达到四周的八个点，如果在要去的方向有别的棋子挡住，马就无法走过去。
XiangqiRules.ways.m = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  //1点
  if (y - 2 >= 0 && x + 1 <= 8 && !map[y - 1][x] && (!map[y - 2][x + 1] || XiangqiTeller.getPiceColor(map[y - 2][x + 1]) != piece.color)) d.push([x + 1, y - 2]);
  //2点
  if (y - 1 >= 0 && x + 2 <= 8 && !map[y][x + 1] && (!map[y - 1][x + 2] || XiangqiTeller.getPiceColor(map[y - 1][x + 2]) != piece.color)) d.push([x + 2, y - 1]);
  //4点
  if (y + 1 <= 9 && x + 2 <= 8 && !map[y][x + 1] && (!map[y + 1][x + 2] || XiangqiTeller.getPiceColor(map[y + 1][x + 2]) != piece.color)) d.push([x + 2, y + 1]);
  //5点
  if (y + 2 <= 9 && x + 1 <= 8 && !map[y + 1][x] && (!map[y + 2][x + 1] || XiangqiTeller.getPiceColor(map[y + 2][x + 1]) != piece.color)) d.push([x + 1, y + 2]);
  //7点
  if (y + 2 <= 9 && x - 1 >= 0 && !map[y + 1][x] && (!map[y + 2][x - 1] || XiangqiTeller.getPiceColor(map[y + 2][x - 1]) != piece.color)) d.push([x - 1, y + 2]);
  //8点
  if (y + 1 <= 9 && x - 2 >= 0 && !map[y][x - 1] && (!map[y + 1][x - 2] || XiangqiTeller.getPiceColor(map[y + 1][x - 2]) != piece.color)) d.push([x - 2, y + 1]);
  //10点
  if (y - 1 >= 0 && x - 2 >= 0 && !map[y][x - 1] && (!map[y - 1][x - 2] || XiangqiTeller.getPiceColor(map[y - 1][x - 2]) != piece.color)) d.push([x - 2, y - 1]);
  //11点
  if (y - 2 >= 0 && x - 1 >= 0 && !map[y - 1][x] && (!map[y - 2][x - 1] || XiangqiTeller.getPiceColor(map[y - 2][x - 1]) != piece.color)) d.push([x - 1, y - 2]);

  return d;
}

//相,象飞田;象不过河，如果田子中间有棋子就不能走。
XiangqiRules.ways.x = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  if (piece.isRed()) { //红方
    //4点半
    if (y + 2 <= 9 && x + 2 <= 8 && !map[y + 1][x + 1] && (!map[y + 2][x + 2] || XiangqiTeller.getPiceColor(map[y + 2][x + 2]) != piece.color)) d.push([x + 2, y + 2]);
    //7点半
    if (y + 2 <= 9 && x - 2 >= 0 && !map[y + 1][x - 1] && (!map[y + 2][x - 2] || XiangqiTeller.getPiceColor(map[y + 2][x - 2]) != piece.color)) d.push([x - 2, y + 2]);
    //1点半
    if (y - 2 >= 5 && x + 2 <= 8 && !map[y - 1][x + 1] && (!map[y - 2][x + 2] || XiangqiTeller.getPiceColor(map[y - 2][x + 2]) != piece.color)) d.push([x + 2, y - 2]);
    //10点半
    if (y - 2 >= 5 && x - 2 >= 0 && !map[y - 1][x - 1] && (!map[y - 2][x - 2] || XiangqiTeller.getPiceColor(map[y - 2][x - 2]) != piece.color)) d.push([x - 2, y - 2]);
  } else {
    //4点半
    if (y + 2 <= 4 && x + 2 <= 8 && !map[y + 1][x + 1] && (!map[y + 2][x + 2] || XiangqiTeller.getPiceColor(map[y + 2][x + 2]) != piece.color)) d.push([x + 2, y + 2]);
    //7点半
    if (y + 2 <= 4 && x - 2 >= 0 && !map[y + 1][x - 1] && (!map[y + 2][x - 2] || XiangqiTeller.getPiceColor(map[y + 2][x - 2]) != piece.color)) d.push([x - 2, y + 2]);
    //1点半
    if (y - 2 >= 0 && x + 2 <= 8 && !map[y - 1][x + 1] && (!map[y - 2][x + 2] || XiangqiTeller.getPiceColor(map[y - 2][x + 2]) != piece.color)) d.push([x + 2, y - 2]);
    //10点半
    if (y - 2 >= 0 && x - 2 >= 0 && !map[y - 1][x - 1] && (!map[y - 2][x - 2] || XiangqiTeller.getPiceColor(map[y - 2][x - 2]) != piece.color)) d.push([x - 2, y - 2]);
  }
  return d;
}

//士，行棋路径只能是九宫内的斜线；
XiangqiRules.ways.s = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  if (piece.isRed()) { //红方
    //4点半
    if (y + 1 <= 9 && x + 1 <= 5 && (!map[y + 1][x + 1] || XiangqiTeller.getPiceColor(map[y + 1][x + 1]) != piece.color)) d.push([x + 1, y + 1]);
    //7点半
    if (y + 1 <= 9 && x - 1 >= 3 && (!map[y + 1][x - 1] || XiangqiTeller.getPiceColor(map[y + 1][x - 1]) != piece.color)) d.push([x - 1, y + 1]);
    //1点半
    if (y - 1 >= 7 && x + 1 <= 5 && (!map[y - 1][x + 1] || XiangqiTeller.getPiceColor(map[y - 1][x + 1]) != piece.color)) d.push([x + 1, y - 1]);
    //10点半
    if (y - 1 >= 7 && x - 1 >= 3 && (!map[y - 1][x - 1] || XiangqiTeller.getPiceColor(map[y - 1][x - 1]) != piece.color)) d.push([x - 1, y - 1]);
  } else {
    //4点半
    if (y + 1 <= 2 && x + 1 <= 5 && (!map[y + 1][x + 1] || XiangqiTeller.getPiceColor(map[y + 1][x + 1]) != piece.color)) d.push([x + 1, y + 1]);
    //7点半
    if (y + 1 <= 2 && x - 1 >= 3 && (!map[y + 1][x - 1] || XiangqiTeller.getPiceColor(map[y + 1][x - 1]) != piece.color)) d.push([x - 1, y + 1]);
    //1点半
    if (y - 1 >= 0 && x + 1 <= 5 && (!map[y - 1][x + 1] || XiangqiTeller.getPiceColor(map[y - 1][x + 1]) != piece.color)) d.push([x + 1, y - 1]);
    //10点半
    if (y - 1 >= 0 && x - 1 >= 3 && (!map[y - 1][x - 1] || XiangqiTeller.getPiceColor(map[y - 1][x - 1]) != piece.color)) d.push([x - 1, y - 1]);
  }
  return d;

}

//将，只能在“九宫”之内活动，可上可下，可左可右，每次走动只能按竖线或横线走动一格。帅与将不能在同一直线上直接对面，否则走方判负。
XiangqiRules.ways.j = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  let redj0 = XiangqiTeller.getPosition(map, "j0");
  var redX = redj0.x;
  var redY = redj0.y;

  let blackJ0 = XiangqiTeller.getPosition(map,"J0");
  var blackX = blackJ0.x;
  var blackY = blackJ0.y;

  /** 检查两个将之间是否有其他棋子，从黑棋“将”这一行开始 到 红棋“将”这一行之间是否有棋子；如果中间无子，则会出现将对将的局面，称为飞将 */
  let flyingGeneral = redX == blackX && map.slice(blackY + 1, redY).every((cols)=> !cols[blackX]);

  if (piece.isRed()) { //红方
    if (flyingGeneral) d.push([blackX, blackY]);
    //下
    if (y + 1 <= 9 && (!map[y + 1][x] || XiangqiTeller.getPiceColor(map[y + 1][x]) != piece.color)) d.push([x, y + 1]);
    //上
    if (y - 1 >= 7 && (!map[y - 1][x] || XiangqiTeller.getPiceColor(map[y - 1][x]) != piece.color)) d.push([x, y - 1]);
    //老将对老将的情况
  } else {
    //老将对老将的情况
    if (flyingGeneral) d.push([redX, redY]);
    //下
    if (y + 1 <= 2 && (!map[y + 1][x] || XiangqiTeller.getPiceColor(map[y + 1][x]) != piece.color)) d.push([x, y + 1]);
    //上
    if (y - 1 >= 0 && (!map[y - 1][x] || XiangqiTeller.getPiceColor(map[y - 1][x]) != piece.color)) d.push([x, y - 1]);
  }
  //右
  if (x + 1 <= 5 && (!map[y][x + 1] || XiangqiTeller.getPiceColor(map[y][x + 1]) != piece.color)) d.push([x + 1, y]);
  //左
  if (x - 1 >= 3 && (!map[y][x - 1] || XiangqiTeller.getPiceColor(map[y][x - 1]) != piece.color)) d.push([x - 1, y]);
  return d;
}

//炮，炮在不吃子的时候，走动与车完全相同，但炮在吃子时，必须跳过一个棋子；
XiangqiRules.ways.p = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  //左侧检索
  var n = 0;
  for (var i = x - 1; i >= 0; i--) {
    if (map[y][i]) {
      if (n == 0) {
        n++;
        continue;
      } else {
        if (XiangqiTeller.getPiceColor(map[y][i]) != piece.color) d.push([i, y]);
        break
      }
    } else {
      if (n == 0) d.push([i, y])
    }
  }
  //右侧检索
  var n = 0;
  for (var i = x + 1; i <= 8; i++) {
    if (map[y][i]) {
      if (n == 0) {
        n++;
        continue;
      } else {
        if (XiangqiTeller.getPiceColor(map[y][i]) != piece.color) d.push([i, y]);
        break
      }
    } else {
      if (n == 0) d.push([i, y])
    }
  }
  //上检索
  var n = 0;
  for (var i = y - 1; i >= 0; i--) {
    if (map[i][x]) {
      if (n == 0) {
        n++;
        continue;
      } else {
        if (XiangqiTeller.getPiceColor(map[i][x]) != piece.color) d.push([x, i]);
        break
      }
    } else {
      if (n == 0) d.push([x, i])
    }
  }
  //下检索
  var n = 0;
  for (var i = y + 1; i <= 9; i++) {
    if (map[i][x]) {
      if (n == 0) {
        n++;
        continue;
      } else {
        if (XiangqiTeller.getPiceColor(map[i][x]) != piece.color) d.push([x, i]);
        break
      }
    } else {
      if (n == 0) d.push([x, i])
    }
  }
  return d;
}

//卒，只能向前走，不能后退，在未过河前，不能横走。过河以后还可左、右移动，但也只能一次一步；
XiangqiRules.ways.z = function (piece, map) {
  var x = piece.x;
  var y = piece.y;

  if(map[y][x] != piece.id){
    return []
  }
  var d = [];

  if (piece.isRed()) { //红方
    //上
    if (y - 1 >= 0 && (!map[y - 1][x] || XiangqiTeller.getPiceColor(map[y - 1][x]) != piece.color)) d.push([x, y - 1]);
    //右
    if (x + 1 <= 8 && y <= 4 && (!map[y][x + 1] || XiangqiTeller.getPiceColor(map[y][x + 1]) != piece.color)) d.push([x + 1, y]);
    //左
    if (x - 1 >= 0 && y <= 4 && (!map[y][x - 1] || XiangqiTeller.getPiceColor(map[y][x - 1]) != piece.color)) d.push([x - 1, y]);
  } else {
    //下
    if (y + 1 <= 9 && (!map[y + 1][x] || XiangqiTeller.getPiceColor(map[y + 1][x]) != piece.color)) d.push([x, y + 1]);
    //右
    if (x + 1 <= 8 && y >= 6 && (!map[y][x + 1] || XiangqiTeller.getPiceColor(map[y][x + 1]) != piece.color)) d.push([x + 1, y]);
    //左
    if (x - 1 >= 0 && y >= 6 && (!map[y][x - 1] || XiangqiTeller.getPiceColor(map[y][x - 1]) != piece.color)) d.push([x - 1, y]);
  }

  return d;
}

XiangqiRules.RelativeValues = {

  //车价值
  c: [
    [206, 208, 207, 213, 214, 213, 207, 208, 206],
    [206, 212, 209, 216, 233, 216, 209, 212, 206],
    [206, 208, 207, 214, 216, 214, 207, 208, 206],
    [206, 213, 213, 216, 216, 216, 213, 213, 206],
    [208, 211, 211, 214, 215, 214, 211, 211, 208],

    [208, 212, 212, 214, 215, 214, 212, 212, 208],
    [204, 209, 204, 212, 214, 212, 204, 209, 204],
    [198, 208, 204, 212, 212, 212, 204, 208, 198],
    [200, 208, 206, 212, 200, 212, 206, 208, 200],
    [194, 206, 204, 212, 200, 212, 204, 206, 194]
  ],

  //马价值
  m: [
    [90, 90, 90, 96, 90, 96, 90, 90, 90],
    [90, 96, 103, 97, 94, 97, 103, 96, 90],
    [92, 98, 99, 103, 99, 103, 99, 98, 92],
    [93, 108, 100, 107, 100, 107, 100, 108, 93],
    [90, 100, 99, 103, 104, 103, 99, 100, 90],

    [90, 98, 101, 102, 103, 102, 101, 98, 90],
    [92, 94, 98, 95, 98, 95, 98, 94, 92],
    [93, 92, 94, 95, 92, 95, 94, 92, 93],
    [85, 90, 92, 93, 78, 93, 92, 90, 85],
    [88, 85, 90, 88, 90, 88, 90, 85, 88]
  ],

  //相价值
  x: [
    [0, 0, 20, 0, 0, 0, 20, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 23, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 20, 0, 0, 0, 20, 0, 0],

    [0, 0, 20, 0, 0, 0, 20, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [18, 0, 0, 0, 23, 0, 0, 0, 18],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 20, 0, 0, 0, 20, 0, 0]
  ],

  //士价值
  s: [
    [0, 0, 0, 20, 0, 20, 0, 0, 0],
    [0, 0, 0, 0, 23, 0, 0, 0, 0],
    [0, 0, 0, 20, 0, 20, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 20, 0, 20, 0, 0, 0],
    [0, 0, 0, 0, 23, 0, 0, 0, 0],
    [0, 0, 0, 20, 0, 20, 0, 0, 0]
  ],

  //奖价值
  j: [
    [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
    [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
    [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
    [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
    [0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
  ],

  //炮价值
  p: [

    [100, 100, 96, 91, 90, 91, 96, 100, 100],
    [98, 98, 96, 92, 89, 92, 96, 98, 98],
    [97, 97, 96, 91, 92, 91, 96, 97, 97],
    [96, 99, 99, 98, 100, 98, 99, 99, 96],
    [96, 96, 96, 96, 100, 96, 96, 96, 96],

    [95, 96, 99, 96, 100, 96, 99, 96, 95],
    [96, 96, 96, 96, 96, 96, 96, 96, 96],
    [97, 96, 100, 99, 101, 99, 100, 96, 97],
    [96, 97, 98, 98, 98, 98, 98, 97, 96],
    [96, 96, 97, 99, 99, 99, 97, 96, 96]
  ],

  //卒价值
  z: [
    [9, 9, 9, 11, 13, 11, 9, 9, 9],
    [19, 24, 34, 42, 44, 42, 34, 24, 19],
    [19, 24, 32, 37, 37, 37, 32, 24, 19],
    [19, 23, 27, 29, 30, 29, 27, 23, 19],
    [14, 18, 20, 27, 29, 27, 20, 18, 14],

    [7, 0, 13, 0, 16, 0, 13, 0, 7],
    [7, 0, 7, 0, 15, 0, 7, 0, 7],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
}

//黑子为红子价值位置的倒置
XiangqiRules.RelativeValues.C = DeepClone(XiangqiRules.RelativeValues.c).reverse();
XiangqiRules.RelativeValues.M = DeepClone(XiangqiRules.RelativeValues.m).reverse();
XiangqiRules.RelativeValues.X = XiangqiRules.RelativeValues.x;
XiangqiRules.RelativeValues.S = XiangqiRules.RelativeValues.s;
XiangqiRules.RelativeValues.J = XiangqiRules.RelativeValues.j;
XiangqiRules.RelativeValues.P = DeepClone(XiangqiRules.RelativeValues.p).reverse();
XiangqiRules.RelativeValues.Z = DeepClone(XiangqiRules.RelativeValues.z).reverse();

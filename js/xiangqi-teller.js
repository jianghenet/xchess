
/**
 * @attr
 *  id: "c0"; map中棋子的唯一标识；用于找name和价值；
 *  name: "c"; 棋子的名字;用户寻找着法；
 *  label: "车"
 *  color: 1; 1红方, -1黑方
 */
class XiangqiPiece {

  constructor(id, row, col) {
    this.id = id;
    this.row = row;
    this.col = col;

    /**  转换成旧的x，y认知 */
    this.x = col;
    this.y = row;

    this.name = XiangqiRules.piecesSets[id];
    let piece = XiangqiRules.piecesHash[this.name];
    this.label = piece.label;
    this.img = piece.img;
    this.color = piece.color;
    this.wayId = piece.wayId;
    this.valueId = piece.valueId;
  }

  getValue() {
    return XiangqiRules.RelativeValues[this.valueId]
  }

  getWays(map) {
    return XiangqiRules.ways[this.wayId](this, map);
  }

  isRed() {
    return this.color === 1;
  }

  isBlack() {
    return this.color === -1;
  }

  positionValue() {
    let value = this.getValue()[this.row][this.col];
    return value * this.color;
  }

  isInDots(map, x, y){
    let validDots = XiangqiRules.ways[this.wayId](this, map);
    return validDots.some((ps_i) => ps_i[0] == x && ps_i[1] == y);
  }

  show() {
    if (this.isShow) {
      com.ct.save();
      com.ct.globalAlpha = this.alpha;
      com.ct.drawImage(ChessImages[this.name].img, com.spaceX * this.x + com.pointStartX, com.spaceY * this.y + com.pointStartY);
      com.ct.restore();
    }
  }
}

XiangqiBoard = {

}

XiangqiTeller = {}

//id是棋子在棋盘上的唯一标识
XiangqiTeller.getPiece = (situation, id) => {
  for (let x = 0; x < situation.length; x++) {
    for (let y = 0; y < situation[x].length; y++) {
      if (situation[x][y] && situation[x][y].id == id) {
        return situation[x][y];
      }
    }
  }
}

XiangqiTeller.getPosition = (map, id) => {
  for (let row = 0; row < 5; row++) {/** 棋盘只有10行 */
    let row1 = 2 * row;
    let row2 = 2 * row + 1;
    for (let col = 0; col < 9; col++) {/** 棋盘只有9列 */
      if (map[row1][col] == id) {
        let x = col;
        let y = row1;
        return { x, y };
      }
      if (map[row2][col] == id) {
        let x = col;
        let y = row2;
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
}

XiangqiTeller.getRowCol = (map, id) => {
  if(!id){
    return null;
  }
  for (let row = 0; row < 5; row++) {/** 棋盘只有10行 */
    let row1 = 2 * row;
    let row2 = 2 * row + 1;
    for (let col = 0; col < 9; col++) {/** 棋盘只有9列 */
      if (map[row1][col] == id) {
        return { row: row1, col: col };
      }
      if (map[row2][col] == id) {
        return { row: row2, col: col };
      }
    }
  }
  return { row: 0, col: 0 };
}

XiangqiTeller.getPiceColor = (id) => {
  let name = XiangqiRules.piecesSets[id];
  return XiangqiRules.piecesHash[name].color;
}

//把坐标生成着法
XiangqiTeller.makeMovesHumanReadable = function (piece, x, y, newX, newY) {
  var h = piece.text || piece.label;
  if (piece.my === 1) {
    var mumTo = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    newX = 8 - newX;
    h += mumTo[8 - x];
    if (newY > y) {
      h += "退";
      if (piece.name == "m" || piece.name == "s" || piece.name == "x") {
        h += mumTo[newX];
      } else {
        h += mumTo[newY - y - 1];
      }
    } else if (newY < y) {
      h += "进";
      if (piece.name == "m" || piece.name == "s" || piece.name == "x") {
        h += mumTo[newX];
      } else {
        h += mumTo[y - newY - 1];
      }
    } else {
      h += "平";
      h += mumTo[newX];
    }
  } else {
    var mumTo = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    h += mumTo[x];
    if (newY > y) {
      h += "进";
      if (piece.name == "M" || piece.name == "S" || piece.name == "X") {
        h += mumTo[newX];
      } else {
        h += mumTo[newY - y - 1];
      }
    } else if (newY < y) {
      h += "退";
      if (piece.name == "M" || piece.name == "S" || piece.name == "X") {
        h += mumTo[newX];
      } else {
        h += mumTo[y - newY - 1];
      }
    } else {
      h += "平";
      h += mumTo[newX];
    }
  }
  return h;
}

//局面评价函数;
//评估棋局 取得棋盘双方棋子价值差
XiangqiTeller.evaluate = function (map, my) {
  var val = 0;
  for (var row = 0; row < map.length; row++) {
    for (var col = 0; col < map[row].length; col++) {
      var key = map[row][col];
      if (key) {
        val += (new XiangqiPiece(key, row, col).positionValue());
      }
    }
  }
  AI.number++;
  return val * my;
}

//检查是否长将
XiangqiTeller.checkFoul = function (pace) {
  var len = parseInt(pace.length, 10);
  if (len > 11 && pace[len - 1] == pace[len - 5] && pace[len - 5] == pace[len - 9]) {
    return pace[len - 4].split("");
  }
  return false;
}

XiangqiTeller.showTheMap = (map) => {
  let html = map.map((mi) => mi.map((mii) => !!mii ? mii : "**").join("|")).join("\n")
  return html;
}

XiangqiTeller.getAvailableMoves = (id, map) => {
  let position = XiangqiTeller.getRowCol(map, id);
  return new XiangqiPiece(id, position.row, position.col).way(map)
}

XiangqiTeller.getValuesById = (id) => {
  let name = XiangqiRules.piecesSets[id];
  let piece = XiangqiRules.piecesHash[name];
  return XiangqiRules.RelativeValues[piece.valueId];
}

XiangqiTeller.pieceCreatFactory = (map, id) => {
  let position = XiangqiTeller.getRowCol(map, id);
  return new XiangqiPiece(id, position.row, position.col);
}
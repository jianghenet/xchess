/*! 一叶孤舟 | qq:28701884 | 欢迎指教 */

var AI = AI||{};

//人工智能初始化
AI.getGoodMove = function(){
  //人工智能开始运作
  var startedTime = new Date().getTime();
  AI.treeDepth=play.depth;
  AI.number=0;

  var val=getAlphaBeta(-99999 ,99999, AI.treeDepth, DeepClone(play.map),play.my);

  //-8888表示AI被将死
  if(val && val.value != -8888){
    let piece = XiangqiTeller.pieceCreatFactory(play.map, val.key);
    var nowTime= new Date().getTime();
    console.log('最佳着法：' + XiangqiTeller.makeMovesHumanReadable(piece,piece.x,piece.y,val.x,val.y) +
                ' 搜索深度：'+AI.treeDepth +
                ' 搜索分支：'+ AI.number + '个' +
                ' 最佳着法评估：'+ val.value + '分'+
                ' 搜索用时：'+ (nowTime-startedTime) + '毫秒')
    return [piece.x,piece.y,val.x,val.y]
  }else {
    return null;
  }
}

//取得棋谱所有己方棋子的着法
AI.getMoves = function (map, color){
  var moves = [];

  //检查是否长将
  var foul=XiangqiTeller.checkFoul(play.pace);

  //取得棋盘上所有棋子
  for (var row=0; row < map.length; row++){
    for (var col=0; col<map[row].length; col++){
      var key = map[row][col];

      if (key){
        let piece = new XiangqiPiece(key, row, col);
        if(piece.color == color){
          let ways = piece.getWays(map);
          ways.forEach(way => {
            let oldX = piece.x;
            let oldY = piece.y;
            let newX = way[0];
            let newY = way[1];
            //仅收录非长将着法
            if(!foul || foul[0] != oldX || foul[1] != oldY || foul[2] != newX || foul[3] != newY){
              moves.push({oldX,oldY,newX,newY,key});
            }
          });
        }
      }
    }
  }

  return moves;
}




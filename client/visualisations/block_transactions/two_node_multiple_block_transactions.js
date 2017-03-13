//var blockUrl = "http://127.0.0.1:3000/api/block"; //When running locally

var blockUrl = "http://146.169.46.159:3000/api/block"; //When running on vm
var count = 300;

// var blockNumberOrHash = 3320744;
// var blockNumberOrHash = 3312599;
// var blockNumberOrHash = 3320787;
// var blockNumberOrHash = 3327346;
// var blockNumberOrHash = 3329340;
// var blockNumberOrHash = 2740710;
var blockNumberOrHash = 3330615;

var url = blockUrl + '/' + blockNumberOrHash + '/WithTransactionsAndAccounts' + '/' + count;

http.get(url, function(res, err) {
  if (res != null) {
    var blocks = JSON.parse(res);
    var blocksTransactions = blocks.allTransactions;
    createGraph(blocksTransactions);
  } else {
    console.error('GET ERROR: ' + err);
  }
})

function createGraph(transactions) {
  var g = new TransactionGraph(transactions);

  var s = new sigma({
    graph: g,
    container: 'container',
    settings: {
    minNodeSize: 1,
    maxNodeSize: 2,
    minEdgeSize: 1,
    maxEdgeSize: 1,
    scalingMode: "inside",
    sideMargin: 20
  }
  })
  //Start Force Atlas algorithm
  s.startForceAtlas2({worker: true, barnesHutOptimize: false});
}

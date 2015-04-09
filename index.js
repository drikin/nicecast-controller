var applescript = require('applescript');
var chokidar    = require('chokidar');
var exec        = require('child_process').exec;
var fs          = require('fs');
var os          = require('os');
var twitter     = require('twitter');

var client = new twitter({
  consumer_key: "",
  consumer_secret: "",
  access_token_key: "",
  access_token_secret: ""
});

var lastSize = null;
var filePath = null;
var timer    = null;

var targetPath = ".";
if (process.argv[2]) {
  targetPath = process.argv[2];
  console.log(targetPath);
}

// One-liner for current directory, ignores .dotfiles
chokidar.watch(targetPath, {ignored: /[\/\\]\./}).on('add', function(path) {
  filePath = path;
  lastSize = fs.statSync(filePath).size;

  startBroadcast();
});

function check() {
  console.log('Check');

  // FIME this is very adhoc check if CallRecorder is working or not
  var child = exec('lsof "' + filePath + '" | grep CallRecor', function(err, stdout, stderr) {
    if (!err) {
      if (stdout === "") {
        stopBroadcast();
      } else {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(check, 10000);
      }
    } else {
      stopBroadcast();
    }
  });
}

function startBroadcast() {
  console.log('Start broadcast');

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(check, 10000);

  var start = 'tell application "Nicecast" to start broadcast';
  asRun(start);

  tweet('backspace.fmのライブ配信を開始しました！ http://backspace.fm/live.html #backspacefm');
}

function stopBroadcast() {
  console.log('Stop broadcast');

  var stop = 'tell application "Nicecast" to stop broadcast';
  asRun(stop);
  tweet('backspace.fmのライブ配信を終了しました。聞いてくれてありがとうございました！ #backspacefm');
}

function asRun(script) {
  if (os.platform() !== "darwin") return;

  applescript.execString(script, function(err, rtn) {
    if (err) {
      // Something went wrong!
    }
    if (Array.isArray(rtn)) {
      rtn.forEach(function(songName) {
        console.log(songName);
      });
    }
  });
}

function tweet(text) {
  client.post('statuses/update', {status: text},  function(error, tweet, response){
    //if(error) throw error;
    //console.log(tweet);  // Tweet body. 
    //console.log(response);  // Raw response object. 
  });
}


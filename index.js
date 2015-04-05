var applescript = require('applescript');
var chokidar    = require('chokidar');
var fs          = require('fs');
var os          = require('os');

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

  var size = fs.statSync(filePath).size;
  if (size !== lastSize) {
    lastSize = size;

    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(check, 10000);
  } else {
    stopBroadcast();
  }
}

function startBroadcast() {
  console.log('Start broadcast');

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(check, 10000);

  var start = 'tell application "Nicecast" to start broadcast';
  asRun(start);
}

function stopBroadcast() {
  console.log('Stop broadcast');

  var stop = 'tell application "Nicecast" to stop broadcast';
  asRun(stop);
}

function asRun(script) {
  if (os.platform !== "darwin") return;

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

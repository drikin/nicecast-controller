var applescript = require('applescript');
var chokidar    = require('chokidar');
var fs          = require('fs');

var lastSize = null;
var filePath = null;

// One-liner for current directory, ignores .dotfiles
chokidar.watch('.', {ignored: /[\/\\]\./}).on('add', function(path) {
  filePath = path;
  lastSize = fs.statSync(filePath).size;

  console.log('Start broadcast');
  startBroadcast();
});

function check() {
  var size = fs.statSync(filePath).size;
  if (size !== lastSize) {
    setTimeout(check, 10000);
  } else {
    stopBroadcast();
  }
}

function startBroadcast() {
  var start = 'tell application "Nicecast" to start broadcast';
  asRun(start);

  setTimeout(check, 10000);
}

function stopBroadcast() {
  var stop = 'tell application "Nicecast" to stop broadcast';
  asRun(stop);
}

function asRun(script) {
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

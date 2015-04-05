var applescript = require('applescript');
var chokidar = require('chokidar');
var lastUpdate = Date();
var timer = null;

// One-liner for current directory, ignores .dotfiles
chokidar.watch('.', {ignored: /[\/\\]\./}).on('change', function(event, path) {
  lastUpdate = Date();

  if (timer) {
    clearTimeout(timer);
  } else {
    console.log('Start broadcast');
    startBroadcast();
  }

  timer = setTimeout(function() {
      console.log('Stop broadcast');
      timer = null;
      stopBroadcast();
  }, 10000);
});


function startBroadcast() {
  var start = 'tell application "Nicecast" to start broadcast';
  asRun(start);
}

function stopBroadcast() {
  var stop = 'tell application "Nicecast" to stop broadcast';
  asRun(stop);
}

function asRun(script) {
  applescript.execString(scrip, function(err, rtn) {
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

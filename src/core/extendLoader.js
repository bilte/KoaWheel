var glob = require('glob');
var path = require('path');
var dir = path.join(__dirname, '../extends');

var loader = {};
loader.init = function() {
  var files = glob.sync(dir + '/*.js');

  for (var file of files) {
    var name = path.basename(file, '.js');
    var p = require(`../extends/${name}`);

    if (typeof p.init === 'function') {
      p.init();
    }
  }
};

module.exports = loader;

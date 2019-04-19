var glob = require('glob');
var path = require('path');
var dir = path.join(__dirname, '../services');

var loader = {};
loader.init = function() {
  var files = glob.sync(dir + '/*.js');

  for (var file of files) {
    var name = path.basename(file, '.js');
    var service = require(`../services/${name}`);

    if (!service._autoLoad) {
      continue;
    }

    if (typeof service.init === 'function') {
      service.init();
    }

    loader[name] = service;
    loader[name.replace(name[0], name[0].toUpperCase())] = service;
  }
};

module.exports = loader;

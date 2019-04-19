// 一些测试
var glob = require('glob');
var path = require('path');
var dir = path.join(__dirname, '../../tests');

var loader = {};

loader.test = function() {
  console.log(`########## test start ##########`);
  var files = glob.sync(dir + '/*.js');

  for (var file of files) {
    var name = path.basename(file, '.js');
    var test = require(`../../tests/${name}`);

    if (!test._autoLoad) {
      continue;
    }

    console.log(`### ${name} start ###`);

    // todo 异步
    for (const key in test) {
      const method = test[key];
      if (typeof method === 'function' && key.indexOf('case_') !== -1) {
        method.apply();
      }
    }

    console.log(`### ${name} end ###`);
  }

  console.log(`########## test end ##########`);
};

module.exports = loader;

/*
 * 模型loader
 * 模型采用sequelize来实现orm,
 *    loader 将自动调用模型的init方法, 请在里面完成数据库映射, 并且返回sequelize.
 *    例子如下:
 * model.init = function(sequelize, DataTypes) {
 *     return sequelize.define('tablename', {})
 *   }
 * }
 *
 * 模型的保留名字: _associations, sequelize, init
 */

var glob = require('glob');
var path = require('path');
var Sequelize = require('sequelize');

const config = require('../../config');

var modelLoader = {};

modelLoader.init = function(params = { force: false }) {
  // 连接数据库
  var _sequelize = new Sequelize(
    config.mysql.db_name,
    config.mysql.user,
    config.mysql.psw,
    {
      host: config.mysql.url,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        // acquire: 30000,
        idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
      },
      timezone: '+08:00', //东八时区
      logging: '',
    },
  );

  var dir = path.join(__dirname, '../models');
  var files = glob.sync(dir + '/*.js');

  for (var file of files) {
    var name = path.basename(file, '.js');
    if (name === '_associations') continue;

    var m = require(`../models/${name}`);

    // 加载模型
    if (!m._autoLoad) {
      continue;
    }

    // 加载orm
    if (typeof m.init != 'undefined' && typeof m.init == 'function') {
      var orm = m.init(_sequelize, Sequelize);
      modelLoader[name] = orm;
      // 添加大写别名
      modelLoader[name.replace(name[0], name[0].toUpperCase())] = orm;
    }
  }

  // 加载关联关系
  // var ass = require(`../models/_associations`);
  // ass.associations(modelLoader);

  var force = params.force;

  // 同步配置
  console.log(`mysql.url: ${config.mysql.url}`);
  _sequelize
    .sync(force ? { force: force } : {})
    .then(function() {
      console.log('Database successed.');
    })
    .catch(function(err) {
      console.log('Database failed. Error: %s', err);
    });

  modelLoader.sequelize = _sequelize;
};

module.exports = modelLoader;

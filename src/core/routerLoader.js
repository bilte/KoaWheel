/*
 * 路由loader
 * loader将自动加载controllers文件夹下的路由, 如
module.exports = {
  'get /getuser': getUser
}
 */

var glob = require('glob');
var path = require('path');

var loader = {};
var router;

const routerMethods = [
  'get',
  'post',
  'put',
  'delete',
  'all',
  'head',
  'options',
  'patch',
];

loader.init = function(params) {
  var dir = path.join(__dirname, '../controllers');
  router = require('koa-router')({
    prefix: params.prefix,
  });

  var files = glob.sync(dir + '/*.js');

  for (var file of files) {
    var name = path.basename(file, '.js');
    var rc = require(`../controllers/${name}`);

    if (!rc._autoLoad) {
      continue;
    }

    var tmpRouter = require('koa-router')();

    for (var r in rc) {
      const route = r.split(' ');

      if (routerMethods.indexOf(route[0]) === -1) {
        // 过滤非http方法
        continue;
      }

      if (route.length == 1) {
        // 处理简写路由
        tmpRouter[route[0]](`/${rc[r].name}`, rc[r]);
        continue;
      }

      if (Array.isArray(rc[r])) {
        tmpRouter[route[0]](route[1], ...rc[r]);
      } else {
        tmpRouter[route[0]](route[1], rc[r]);
      }
    }

    router.use(`/${name}`, tmpRouter.routes(), tmpRouter.allowedMethods());
  }

  router.all('*', async (ctx, next) => {
    ctx.status = 404;
  });

  return router;
};

module.exports = loader;

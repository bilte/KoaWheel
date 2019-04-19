const Koa = require('koa');
const app = new Koa();
const config = require('./config');

var program = require('commander');
program
  .version('0.1.0')
  .option('--test', '运行测试代码')
  .parse(process.argv);

// ServiceLoader
const serviceLoader = require('./src/core/serviceLoader');
serviceLoader.init();

// ExtendLoader
const extendLoader = require('./src/core/extendLoader');
extendLoader.init();

// redis
if (config.redis.enable) {
  const redis = require('./src/utils/redis');
  redis.init();
}

// 连接数据库, 加载数据模型, ModelLoader
// todo: 适配多个数据库
if (config.mysql.enable) {
  const modelLoader = require('./src/core/modelLoader');
  modelLoader.init(); // 这个需要先执行, 然后后续的模块才可以取得model
}

// error handler
const onerror = require('koa-onerror');
onerror(app);

// 跨域问题
const cors = require('./src/middlewares/cors');
app.use(cors);

// 健康检测
const alive = require('./src/middlewares/alive')({
  path: '/alive',
  body: 'ok',
});
app.use(alive);

// 自动解析resquset的body
const bodyparser = require('koa-bodyparser');
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  }),
);

// 美化返回的json数据
const json = require('koa-json');
app.use(json());

// 静态资源
const koaStatic = require('koa-static');
app.use(koaStatic(__dirname + '/public'));

// 日志
const logUtil = require('./src/middlewares/log4');
app.use(logUtil.processor);

// 格式化response输出
const responseFormatter = require('./src/middlewares/responseFormatter');
app.use(responseFormatter);

// user 中间件
const user = require('./src/middlewares/user');
app.use(user);

// 路由
const prefix = require('./src/middlewares/URLPrefix')({
  prefix: '/api/',
});
app.use(prefix);
const routerLoader = require('./src/core/routerLoader');
const router = routerLoader.init({
  prefix: '/api',
});
app.use(router.routes(), router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

console.log('config:');
console.log(config);
console.log(`env = ${config.env}`);
console.log(`port = ${config.port}`);
console.log('########## server start ##########\n');

// test
if (program.test) {
  require('./src/core/testLoader').test();
}

module.exports = app;

// 一些测试

const { Joke } = require('../core/serviceLoader');
const utils = require('../utils/utils');

// hello world
const helloWorld = async (ctx, next) => {
  ctx.body = {
    msg: 'hello world',
  };
};

// 如果路由名称和方法名称一样, 配置可以简化成:
// get: simple
const simple = async (ctx, next) => {
  console.log(Joke);
  ctx.body = true;
};

const aError = async (ctx, next) => {
  ctx.throw(501, '你得到了一个错误', { code: 1000 });
};

// 如果希望在方法运行前, 先执行其他方法, 配置可以用:
// 'get /hello': [check_hello, hello],
const check_hello = async (ctx, next) => {
  var a = ctx.request.query.a;
  ctx.assert(a, 400, 'check_hello', { code: 1000 });
  next();
};
const hello = async (ctx, next) => {
  ctx.body = 'hello word';
};

const longTime = async (ctx, next) => {
  console.log('start');
  await utils.sleep(3000);
  console.log('end');

  ctx.body = '3000ms';
};

// 忽略代码格式化, 用于返回文件
const ignoreFormatting = async (ctx, next) => {
  ctx.state.ignoreFormatting = true;
  ctx.body = 'ignoreFormatting';
};

module.exports = {
  _autoLoad: true,
  'get /helloworld': helloWorld,
  get: simple,
  'get /aError': aError,
  'get /hello': [check_hello, hello],
  'get /longTime': longTime,
};

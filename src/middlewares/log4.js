var log4js = require('log4js');

// 加载配置文件
log4js.configure(require('../../config/log4'));

var logUtil = {};

var errorLogger = log4js.getLogger('error');
var requestLogger = log4js.getLogger('request');

// 封装错误日志
logUtil.logError = function(ctx, error, resTime) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime));
  }
};

// 封装响应日志
logUtil.logResponse = function(ctx, resTime) {
  if (ctx) {
    requestLogger.debug(formatRes(ctx, resTime));
  }
};

//格式化响应日志
var formatRes = function(ctx, resTime) {
  var text = `
method: ${ctx.request.method}
path: ${ctx.request.originalUrl}
client ip: ${ctx.request.ip}
${ctx.request.method === 'GET' ? 'query: ' : 'body:\n'} ${JSON.stringify(
    ctx.request.query,
  )}
time: ${resTime}
response status: ${ctx.status}
response body:
${JSON.stringify(ctx.body)}\n`;
  return text;
};

// 格式化错误日志
var formatError = function(ctx, err, resTime) {
  var text = `
method: ${ctx.request.method}
path: ${ctx.request.originalUrl}
client ip: ${ctx.request.ip}
${ctx.request.method === 'GET' ? 'query: ' : 'body:\n'} ${JSON.stringify(
    ctx.request.query,
  )}
time: ${resTime}
response status: ${ctx.status}
err name: ${err.name}
err message: ${err.message}
err stack: ${err.stack}\n`;
  return text;
};

// 格式化请求日志
var formatReqLog = function(req, resTime) {
  var text = `
method: ${req.method}
originalUrl: ${req.originalUrl}
client ip: ${req.ip}
${req.method === 'GET' ? 'query: ' : 'body:\n'} ${JSON.stringify(req.query)}
time: resTime \n`;
  return text;
};

logUtil.processor = async (ctx, next) => {
  // 响应开始时间
  const start = new Date();
  // 响应间隔时间
  var ms;
  try {
    // 开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    logUtil.logError(ctx, error, ms);
  }
};

module.exports = logUtil;

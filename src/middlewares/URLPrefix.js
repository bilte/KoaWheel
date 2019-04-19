// 校验请求的前缀
module.exports = function(params) {
  var prefix = params.prefix;
  return async (ctx, next) => {
    if (prefix && ctx.originalUrl.indexOf(prefix) !== 0) {
      ctx.throw(404);
    }
    await next();
  };
};

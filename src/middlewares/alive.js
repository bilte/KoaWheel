// 校验请求的前缀
module.exports = function(params) {
  var path = params.path;
  var body = params.body;
  return async (ctx, next) => {
    if (ctx.originalUrl === path) {
      ctx.body = body;
      return;
    }
    await next();
  };
};

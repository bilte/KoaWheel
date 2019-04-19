var formatter = async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }

    if (ctx.state.ignoreFormatting) {
      return;
    }

    if (ctx.body === null) {
      // fix: koa在 ctx.body 为空的时候会设置status=204, 导致不返回数据给前台
      ctx.status = 200;
    }

    ctx.body = {
      timestamp: +new Date(),
      success: ctx.body !== false,
      data: ctx.body,
    };
  } catch (error) {
    ctx.status = error.status || 200;
    ctx.body = {
      errorCode: error.code || 9999,
      errorMessage: error.message || '未知错误',
      timestamp: +new Date(),
      success: false,
    };
    throw error;
  }
};

module.exports = formatter;

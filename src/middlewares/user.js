// 用户, 角色, 权限相关中间件
module.exports = async function(ctx, next) {
  // ctx.state.token = ''
  // ctx.state.user = {}
  // ctx.state.user.id = ''
  // ctx.state.user.role = ''

  await next();
};

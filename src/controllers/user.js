// 获取用户
const getUser = async (ctx, next) => {
  ctx.body = {
    username: '骨傲天',
    age: 30,
  };
};

// 用户注册
const registerUser = async (ctx, next) => {
  console.log('registerUser', ctx.request.body);
};

module.exports = {
  _autoLoad: true,
  'get /getuser': getUser,
  'get /registeruser': registerUser,
};

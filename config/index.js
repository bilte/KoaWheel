// 根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象

var NODE_ENV = process.env.NODE_ENV;
var env = 'development';

if (NODE_ENV === `dev` || NODE_ENV === `development`) {
  env = 'development';
} else if (NODE_ENV === `prod` || NODE_ENV === `production`) {
  env = `production`;
} else if (NODE_ENV === `sit`) {
  env = `sit`;
}

module.exports = require(`./${env}`);

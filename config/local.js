/**
 * 本地环境的配置内容
 */

module.exports = {
  // 环境名称
  env: 'development',
  // 服务端口号
  port: 3003,

  // 数据库
  mysql: {
    enable: true,
    url: 'localhost',
    user: 'root',
    psw: '123456',
    db_name: 'sloth',
  },

  // redis
  redis: {
    enable: false,
    sentinelSenable: false,
    //哨兵
    sentinels: [{ host: '', port: '' }],
    name: '',
    url: '',
    port: 8080,
    password: '',
  },
};

/**
 * log4js日志配置
 */

// 基础配置
var config = {
  replaceConsole: true,
  // pm2: true,
  // pm2InstanceVar: 'INSTANCE_ID',
  appenders: {
    // 控制台输出
    stdout: {
      type: 'stdout',
    },
    // 请求日志
    request: {
      type: 'file',
      filename: 'logs/request/request.log',
      encoding: 'utf-8',
      // 文件最大存储空间(字节)，当文件内容超出, 会自动生成序列自增长的文件
      maxLogSize: 1000 * 1000 * 500,
      // default value = 5.当文件内容超过文件存储空间时，备份文件的数量
      backups: 100,
    },
    // 错误日志
    error: {
      type: 'dateFile',
      filename: 'logs/error/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
    },
    // 其他日志
    other: {
      type: 'dateFile',
      filename: 'logs/other/',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
    },
  },
  categories: {
    default: { appenders: ['stdout', 'other'], level: 'info' },
    error: { appenders: ['stdout', 'error'], level: 'error' },
    request: { appenders: ['stdout', 'request'], level: 'debug' },
  },
};

if (process.env.NODE_ENV === `prod` || process.env.NODE_ENV === `production`) {
  // 生产环境
  // 取消控制台输出
  config.categories.default.appenders = ['other'];
  config.categories.error.appenders = ['error'];
  config.categories.request.appenders = ['request'];
  // 调整request的日志级别
  config.categories.request.level = ['info'];
} else if (process.env.NODE_ENV === `sit`) {
  // sit环境
  // 修改请求日志输出格式为日期
  config.appenders.request = {
    type: 'dateFile',
    filename: 'logs/request/',
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true,
    encoding: 'utf-8',
  };
} else {
  // 开发环境
  // 修改请求日志输出格式为日期
  config.appenders.request = {
    type: 'dateFile',
    filename: 'logs/request/',
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true,
    encoding: 'utf-8',
  };
}

module.exports = config;

/*
 * type:file 日志输出为普通文件, 会随着文件大小的变化自动份文件
 * 相关有效配置包含:maxLogSize, backups, filename
 * 相关无效配置包含:pattern, alwaysIncludePattern
 *
 * type:datefile 输出按时间分文件的日志, 随着时间的推移, 自动创建新的文件
 * 相关有效配置包含: pattern, alwaysIncludePattern, filename
 * 相关无效配置包含: maxLogSize, backups
 *
 * 在file模式下,暂时没有找到可以追加时间标签的命名方法
 * 在datefile模式下, 暂时没有找到同一时间下文件过大后自动分文件的方法
 */

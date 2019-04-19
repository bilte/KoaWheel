var Redis = require('ioredis');
var config = require('../../config');

var redis;

function init(namespace = '') {
  var ns = namespace;
  if (process.env.NODE_ENV === 'development') {
    ns = 'dev_' + namespace;
  }
  if (config.redis.sentinelsEnable) {
    redis = new Redis({
      sentinels: config.redis.sentinels,
      name: config.redis.name,
      password: config.redis.password,
      keyPrefix: ns,
    });
  } else {
    redis = new Redis({
      port: config.redis.port,
      host: config.redis.url,
      family: 4,
      password: config.redis.password,
      keyPrefix: ns,
    });
  }

  redis.on('error', function(error) {
    console.log(error);
  });

  redis.on('ready', function() {
    console.log('redisCache connection succeed');
  });
}

function setValue(key, value, expire) {
  redis.set(key, value);
  if (expire) {
    redis.expire(key, expire);
  }
}

function getValue(key) {
  return new Promise(resolve => {
    redis.get(key, function(err, value) {
      resolve(value);
    });
  });
}

function setFields(key, fields, expire) {
  redis.hmset(key, fields);
  if (expire) {
    redis.expire(key, expire);
  }
}

function getFields(key) {
  return new Promise(resolve => {
    redis.hgetall(key, function(err, fields) {
      resolve(fields);
    });
  });
}

function del(key) {
  return new Promise(resolve => {
    redis.del(key, function(err, fields) {
      resolve(fields);
    });
  });
}

function getRedis() {
  return redis;
}

module.exports = {
  getRedis,
  init,
  setValue,
  getValue,
  setFields,
  getFields,
  del,
};

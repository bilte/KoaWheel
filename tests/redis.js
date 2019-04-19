// 一个测试类
var redis = require('../src/utils/redis');
var test = {};

test._autoLoad = true;

// set
test.case_1 = async function() {
  redis.setValue('a', 'aaaaaaa');
  redis.setValue('b', 'bbbbb', 5);
  redis.setFields('json1', { a: 'a', b: 2, c: 3, d: { d1: 1 } });
  redis.setFields('json2', ['a', 'b']);
};

// get
test.case_2 = async function() {
  var v = await redis.getValue('a');
  console.log(`redis: a ${v}`);

  v = await redis.getValue('b');
  console.log(`redis: b ${v}`);

  v = await redis.getFields('json1');
  console.log(`redis: json1 `);
  console.dir(v);

  v = await redis.getFields('json2');
  console.log(`redis: json2 `);
  console.dir(v);
};

// 删除
test.case_2 = async function() {
  await redis.setValue('c', 'c');
  v = await redis.getValue('c');
  console.log(`set c, c : ${v}`);
  await redis.del('c');
  v = await redis.getValue('c');
  console.log(`del c, c: ${v}`);

  await redis.setFields('json3', ['a', 'b']);
  await redis.del('json3');

  // key还在, 但是值为null
  await redis.setValue('d', '11111');
  await redis.setValue('d', null);

  await redis.del('cc');
};

module.exports = test;

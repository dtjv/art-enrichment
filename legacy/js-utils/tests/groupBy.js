var test    = require('tape');
var groupBy = require('../libs/groupBy.js');

test('.groupBy()', function (t) {
  var data = [
    {course: 'math',    quarter: 'fall'},
    {course: 'math',    quarter: 'winter'},
    {course: 'math',    quarter: 'spring'},
    {course: 'spanish', quarter: 'winter'},
    {course: 'spanish', quarter: 'spring'},
    {course: 'history', quarter: 'spring'}
  ];
  var keyList = ['math', 'spanish', 'history'];

  var callback = function (obj) {
    return obj.course;
  };

  var group = groupBy(data, callback);
  var keys = Object.keys(group);

  t.ok(typeof group === 'object', 'object returned');
  t.equal(keys.length, 3, 'group count ok');
  t.deepEqual(keys, keyList, 'grouped by callback key');
  t.equal(group.math.length, 3, 'group contents ok');

  t.end();
});

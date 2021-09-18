var test    = require('tape');
var flatten = require('../libs/flatten.js');

test('.flatten()', function (t) {
  var a = [[1], [2], [3], [4], [5]];
  var b = [1, [2, 3], [4, 5, 6]];
  var c = [1, [2, 3, [4, 5, [6, 7]]], [8, 9]];

  t.deepEqual(flatten(a), [1, 2, 3, 4, 5], 'flattens 2d array of single arrays');
  t.deepEqual(flatten(b), [1, 2, 3, 4, 5, 6], 'flattens 2d array of n-depth arrays');
  t.deepEqual(flatten(c), [1, 2, 3, 4, 5, 6, 7, 8, 9], 'flattens n-d array of n-depth arrays');
  t.end();
});

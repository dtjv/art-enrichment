var test = require('tape');
var trim = require('../libs/trim.js');

test('.trim()', function (t) {
  var a = [1, 2, '', 3, ''];
  var b = [1, null, 3];
  var c = [undefined, 2, 3];

  t.equal(trim(a).length, 3, 'trimmed blanks');
  t.equal(trim(b).length, 2, 'trimmed null');
  t.equal(trim(c).length, 2, 'trimmed undefined');
  t.end();
});

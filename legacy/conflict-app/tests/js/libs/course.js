var test   = require('tape');
var Course = require('../../../src/js/libs/course');

test('new Course()', function (t) {
  var row = 0;
  var data = ['timestamp', 'date', 'start', 'class', 'duration', 'project', 'end', 'toolA, toolB, toolC'];

  var course = new Course(row, data);

  t.ok(course instanceof Course, 'course is a Course');

  for (var key in course) {
    if (course.hasOwnProperty(key)) {
      switch (key) {
        case 'tools':
          t.ok(course[key] instanceof Array, 'tools property is an Array');
          break;
        case 'range':
          t.equal(course[key], 'A2:H2', 'a1Notation for range set');
          break;
        default:
          t.equal(course[key], key, 'property ' + key + ' is set');
      }
    }
  }

  t.equal(course.tools.length, 3, 'tools property holds 3 values');
  t.end();
});

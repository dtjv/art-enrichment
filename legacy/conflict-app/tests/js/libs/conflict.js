var test       = require('tape');
var before     = test;
var proxyquire = require('proxyquire');

var BrowserStub     = {};
var SpreadsheetStub = {};

var App = proxyquire(
  '../../../src/js/libs/conflict',
  {
    './globals/browser': BrowserStub,
    './globals/spreadsheet': SpreadsheetStub
  }
);

/**
 * Defines test data.
 *
 * @return {Object} Returns the object with access to test data sets.
 */
var setup = function () {
  // Fake data straight from the spreadsheet
  var rangeData = [
    ['timestamp', 'date', 'start', 'class', 'duration', 'project', 'end', 'tools'],

    [new Date(2015, 7, 15),
     new Date(2015, 10, 1),
     new Date(2015, 10, 1, 9, 0, 0),
     'KA',
     new Date(2015, 10, 1, 2, 0, 0),
     'Painting',
     new Date(2015, 10, 1, 11, 0, 0),
     'a, b, c'],

    [new Date(2015, 7, 15),
     new Date(2015, 10, 1),
     new Date(2015, 10, 1, 10, 0, 0),
     '4A',
     new Date(2015, 10, 1, 1, 0, 0),
     'Drawing',
     new Date(2015, 10, 1, 12, 0, 0),
     'b, d'],

    [new Date(2015, 7, 15),
     new Date(2015, 10, 1),
     new Date(2015, 10, 1, 11, 0, 0),
     '6B', new Date(2015, 10, 1, 1, 0, 0),
     'Sculpture',
     new Date(2015, 10, 1, 1, 0, 0),
     'x, y, z']
  ];

  // Sort by `.start` - since spreadsheet will be sorted as well.
  var coursesA = [
    {
      date: new Date(2015, 10, 1),
      start: new Date(2015, 10, 1, 9, 0, 0),
      end: new Date(2015, 10, 1, 11, 0, 0),
      tools: ['a', 'b', 'c']
    },
    {
      date: new Date(2015, 10, 1),
      start: new Date(2015, 10, 1, 10, 0, 0),
      end: new Date(2015, 10, 1, 12, 0, 0),
      tools: ['b', 'd']
    }
  ];

  var coursesB = [
    {
      date: new Date(2015, 10, 1),
      start: new Date(2015, 10, 1, 9, 0, 0),
      end: new Date(2015, 10, 1, 11, 0, 0),
      tools: ['a', 'b', 'c']
    },
    {
      date: new Date(2015, 10, 1),
      start: new Date(2015, 10, 1, 11, 0, 0),
      end: new Date(2015, 10, 1, 1, 0, 0),
      tools: ['x', 'y', 'z']
    }
  ];

  var coursesC = [
    {
      date: new Date(2015, 10, 1),
      start: new Date(2015, 10, 1, 9, 0, 0),
      end: new Date(2015, 10, 1, 11, 0, 0),
      tools: ['a', 'b', 'c']
    },
    {
      date: new Date(2015, 10, 1),
      start: new Date(2015, 10, 1, 12, 0, 0),
      end: new Date(2015, 10, 1, 1, 0, 0),
      tools: ['a', 'b', 'c']
    }
  ];

  var runMethods = ['setup', 'getConflicts', 'showConflicts', 'teardown'];

  return {
    rangeData: rangeData,
    coursesA: coursesA,
    coursesB: coursesB,
    coursesC: coursesC,
    runMethods: runMethods
  };
};



before('Stub globals', function (t) {
  SpreadsheetStub.getActive = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.getSheetByName = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.getDataRange = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.activate = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.getRange = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.setBackground = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.getNumRows = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.sort = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.setFormulas = function () {
    return SpreadsheetStub;
  };

  t.pass('All stubbed!');
  t.end();
});



test('new App()', function (t) {
  var appA = new App();

  t.equal(appA.action, 'show', 'default option set');
  t.equal(appA.minColor, 0xFF5555, 'default option set');
  t.equal(appA.maxColor, 0xFFEEEE, 'default option set');

  var appB = new App({
    action: 'test',
    color: {
      min: '123',
      max: '345'
    }
  });

  t.equal(appB.action, 'test', 'action option applied');
  t.equal(appB.minColor, '123', 'minColor option applied');
  t.equal(appB.maxColor, '345', 'maxColor option applied');
  t.end();
});



test('App.run()', function (t) {
  var called = [];
  var fixtures = setup();

  var appA = new App();

  appA.setup = function () {
    called.push(fixtures.runMethods[0]);
    return appA;
  };

  appA.getConflicts = function () {
    called.push(fixtures.runMethods[1]);
    return appA;
  };

  appA.showConflicts = function () {
    called.push(fixtures.runMethods[2]);
    return appA;
  };

  appA.teardown = function () {
    called.push(fixtures.runMethods[3]);
    return appA;
  };

  appA.run();

  t.deepEqual(called, fixtures.runMethods, 'all methods called');
  t.test('App.run() w/ invalid action', function (st) {
    st.plan(1);

    var msg;

    BrowserStub.msgBox = function (str) {
      msg = str;
    };

    var appB = new App({action: 'test'});
    appB.run();

    st.equal(msg, 'Error: App given invalid action: test', 'invalid action detected');

    delete BrowserStub.msgBox;
  });
  t.end();
});



test('App.setup()', function (t) {
  var fixtures = setup();

  SpreadsheetStub.getValues = function () {
    return fixtures.rangeData;
  };

  new App().setup();
  t.pass('only calls a global method');
  t.end();
});



test('App.teardown()', function (t) {
  var fixtures = setup();

  SpreadsheetStub.getValues = function () {
    return fixtures.rangeData;
  };

  var app = new App();
  app.setup().teardown();

  t.pass('only calls a global method');
  t.end();
});



test('App._getRandomColor()', function (t) {
  var color = App._getRandomColor(0x555555, 0xDDDDDD);
  var num = parseInt(color.substr(1), 16);

  t.equal(color[0], '#', '"#" exists in color value');
  t.ok(Number.isInteger(num), 'color is a number');
  t.end();
});



test('App._filterConflicts()', function (t) {
  var fixtures = setup();

  t.ok(App._filterConflicts(fixtures.coursesA[0], 0, fixtures.coursesA), 'detects conflict (time + tools)');
  t.notOk(App._filterConflicts(fixtures.coursesB[0], 0, fixtures.coursesB), 'detects no conflict (time)');
  t.notOk(App._filterConflicts(fixtures.coursesC[0], 0, fixtures.coursesC), 'detects no conflict (date)');
  t.end();
});



test('App.getConflicts()', function (t) {
  var fixtures = setup();

  SpreadsheetStub.getValues = function () {
    return fixtures.rangeData;
  };

  var app = new App();
  app.setup();
  app.getConflicts();

  t.equal(app.conflicts.length, 2, 'detected all conflicts');
  t.equal(app.conflicts[0].class, 'KA', 'detected conflict');
  t.equal(app.conflicts[1].class, '4A', 'detected conflict');
  t.end();

  delete SpreadsheetStub.getValues;
});



test('App.showConflicts()', function (t) {
  var colors   = [];
  var fixtures = setup();

  SpreadsheetStub.getValues = function () {
    return fixtures.rangeData;
  };

  var app = new App();
  app.setup();

  // Reset `SpreadsheetStub.setBackground()` to capture values passed in.
  SpreadsheetStub.setBackground = function (color) {
    colors.push(color);
    return SpreadsheetStub;
  };

  app.getConflicts();
  app.showConflicts();

  t.equal(colors.length, 2, 'shows all conflicts');
  t.ok(colors[0] === colors[1], 'courses in conflict have same highlight');
  t.end();

  delete SpreadsheetStub.getValues;
  delete SpreadsheetStub.setBackground;
});



test('App._setRangeValues()', function (t) {
  var data = [
    ['C3:D4', 'C3:D5'],
    ['C4:D4', 'C4:D5']
  ];
  var arr = App._setRangeValues(2, 2, 'C{{row}}:D{{col}}', 3, 4);

  t.ok(arr instanceof Array, 'returns Array');
  t.ok(arr[0] instanceof Array, 'returns 2D Array');
  t.equal(arr.length, 2, 'returned Array has 2 rows');
  t.equal(arr[0].length, 2, 'returned Array has 2 columns');
  t.deepEqual(arr, data, 'returned Array is built correctly');
  t.end();
});



test('App._getRandomInt()', function (t) {
  var min = 5;
  var max = 10;
  var randomInt = App._getRandomInt(min, max);

  t.ok(randomInt >= min && randomInt <= max, 'random integer is between MIN and MAX');
  t.end();
});


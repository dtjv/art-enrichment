var test       = require('tape');
var before     = test;
var proxyquire = require('proxyquire');

var BrowserStub     = {};
var FormStub        = {};
var SpreadsheetStub = {};

var App = proxyquire(
  '../../../src/js/libs/update',
  {
    './globals/browser': BrowserStub,
    './globals/form': FormStub,
    './globals/spreadsheet': SpreadsheetStub
  }
);

/**
 * Defines fixtures
 * @return {Object} Returns the object of data to test.
 */
var setup = function () {

  // Simulated configuration data from Configuration sheet.
  var configData = [
    ['sheet-id', 'sheet-name', 'column', 'form-id', 'field-name'],
    ['22', 'test-a', 'A', '44', 'projects'],
    ['33', 'test-b', 'B', '55', 'courses']
  ];

  // The expected outcome from loading `configData`
  var configDataExpected = [
    {ssID: '22', sheet: 'test-a', column: 'A', formID: '44', field: 'projects'},
    {ssID: '33', sheet: 'test-b', column: 'B', formID: '55', field: 'courses'}
  ];

  // Each row in is the simulated column data associated with a configuration.
  var columnData = [
    [[10], [20], [30]],
    [[100], [200], [300]]
  ];

  // The expected outcome from `.sync()`;
  var columnDataExpected = [
    [10, 20, 30],
    [100, 200, 300]
  ];

  // An array of simulated Items on a Google Form.
  var items = [
    {
      getTitle: function () {
        return 'projects';
      },
      asListItem: function () {
        return {
          setChoiceValues: function () {}
        };
      }
    },
    {
      getTitle: function () {
        return 'courses';
      },
      asListItem: function () {
        return {
          setChoiceValues: function () {}
        };
      }
    }
  ];

  return {
    items: items,
    configData: configData,
    columnData: columnData,
    configDataExpected: configDataExpected,
    columnDataExpected: columnDataExpected
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
  SpreadsheetStub.openById = function () {
    return SpreadsheetStub;
  };
  SpreadsheetStub.getRange = function () {
    return SpreadsheetStub;
  };
  FormStub.openById = function () {
    return FormStub;
  };

  t.pass('All stubbed!');
  t.end();
});



test('new App()', function (t) {
  var app = new App();

  t.ok(app instanceof App, 'app is an App');
  t.equal(app.action, 'sync', 'sets default action');
  t.end();
});



test('new App() w/ invalid action', function (t) {
  var msg;

  BrowserStub.msgBox = function (str) {
    msg = str;
  };

  var app = new App({action: 'test'});
  app.run();

  t.equal(msg, 'Error: App given invalid action: test', 'invalid action detected');
  t.end();
});



test('App.run()', function (t) {
  var called = [];

  var app = new App();

  app.setup = function () {
    called.push('setup');
    return app;
  };

  app.sync = function () {
    called.push('sync');
    return app;
  };

  app.teardown = function () {
    called.push('teardown');
    return app;
  };

  app.run();

  t.deepEqual(called, ['setup', 'sync', 'teardown'], 'all methods called');
  t.end();
});



test('App.setup()', function (t) {
  var fixtures = setup();

  // `.setup()` calls this global to retrieve data from the spreadsheet. Give it fake data.
  SpreadsheetStub.getValues = function () {
    return fixtures.configData;
  };

  var app = new App();
  app.setup();

  t.ok(app.configs instanceof Array, 'loads configurations in an Array');
  t.equal(app.configs.length, 2, 'loads all configurations');
  t.deepEqual(app.configs, fixtures.configDataExpected, 'loads configuration data');
  t.end();

  delete SpreadsheetStub.getValues;
});



test('App._getItem()', function (t) {
  var items = setup().items;

  // `._getItem()` calls this to search for target field. Give it fake items.
  FormStub.getItems = function () {
    return items;
  };

  var itemA = App._getItem('44', 'projects');

  t.equal(typeof itemA, 'object', 'item is an Object');
  t.equal(itemA.getTitle(), 'projects', 'item found');

  var itemB = App._getItem('55', 'courses');

  t.equal(typeof itemB, 'object', 'item is an Object');
  t.equal(itemB.getTitle(), 'courses', 'item found');
  t.end();

  delete FormStub.getItems;
});



test('App._processConfig()', function (t) {
  var fixtures = setup();
  var cfg      = 0;
  var app      = new App();

  // Give app fake config
  SpreadsheetStub.getValues = function () {
    return fixtures.configData;
  };

  app.setup();

  // `._processConfig()` will call this to retrieve column values. Give it fake values.
  SpreadsheetStub.getValues = function () {
    return fixtures.columnData[cfg];
  };

  // `._processConfig()` will indirectly call this to search for target field. Give it fake items.
  FormStub.getItems = function () {
    return fixtures.items;
  };

  // Go through each config and see if `._processConfig` returns the correct data.
  for (var i = 0; i < app.configs.length; i += 1, cfg += 1) {
    var results = App._processConfig(app.configs[i]);

    t.deepEqual(results, fixtures.columnDataExpected[i], 'passed integration');
  }

  delete SpreadsheetStub.getValues;
  delete FormStub.getItems;

  t.end();
});



test('App.sync()', function (t) {
  var fixtures = setup();
  var called   = 0;
  var errors   = 0;

  var app = new App();

  SpreadsheetStub.getValues = function () {
    return fixtures.configData;
  };

  app.setup();

  App._processConfig = function () {
    called += 1;
  };

  app.sync();

  t.equal(called, 2, 'processed all configurations');

  App._processConfig = function () {
    errors += 1;
    throw new Error(errors);
  };

  app.sync();

  t.equal(errors, 2, 'caught all errors');
  t.equal(app.errors.length, 2, 'cached all errors');
  t.end();

  delete SpreadsheetStub.getValues;
});



test('App.teardown()', function (t) {
  var msg;

  BrowserStub.msgBox = function (str) {
    msg = str;
  };

  var app = new App({action: 'test'});

  app.errors = ['error message one', 'error message two'];
  app.teardown();

  t.equal(msg, 'Errors: error message one\nerror message two', 'reports errors');

  app.errors = [];
  app.teardown();

  t.equal(msg, 'Update completed!', 'displays success message');
  t.end();

  delete BrowserStub.msgBox;
});

/**
 * Splits an array of objects into sets, grouped by the result of running each value through `cb`.
 * `cb` is called with 3 arguments: `value, index, collection`.
 *
 * @param  {Array}    arr The array of objects to group
 * @param  {Function} cb  The callback function that returns the value used to split the collection.
 * @return {Object}       The newly created grouped collection.
 */
var groupBy = function (arr, cb) {
  var group = {};
  var groupName;

  arr.forEach(function (obj) {
    groupName = cb(obj);
    if (group[groupName]) {
      group[groupName].push(obj);
    } else {
      group[groupName] = [obj];
    }
  });

  return group;
};

module.exports = groupBy;

/**
 * Remove empty, null, and undefined entries in `arr`.
 *
 * @param  {Array} arr The array to trim.
 * @return {Array}     The new array sans 'blank' elements.
 */
var trim = function (arr) {
  return arr.filter(function (value) {
    return value;
  });
};

module.exports = trim;

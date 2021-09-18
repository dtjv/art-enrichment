/**
 * Flattens a nested array.
 *
 * @param  {Array} arr The array to flatten.
 * @return {Array}     Returns the new flattened array.
 */
export const flatten = (arr) => {
  var result = []

  if (arr.length === 1) {
    return arr[0]
  }

  for (var i = 0; i < arr.length; i += 1) {
    result = result.concat(arr[i] instanceof Array ? flatten(arr[i]) : arr[i])
  }

  return result
}

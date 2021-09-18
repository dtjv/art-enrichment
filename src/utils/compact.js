/**
 * Remove empty, null, and undefined entries in `arr`.
 *
 * @param  {Array} arr The array to trim.
 * @return {Array}     The new array sans 'blank' elements.
 */
export const compact = (arr) => arr.filter((value) => value)

/**
 * Returns a random integer between min (included) and max (excluded).
 *
 * @private
 * @param  {number} min Lower bound for return value.
 * @param  {number} max Upper bound for return value.
 * @return {number}     A random integer.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

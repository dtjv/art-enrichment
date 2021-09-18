import { groupBy } from 'lodash'
import { Course } from './course'
import { getRandomInt } from './utils/getRandomInt'

/**
 * Identifies schedule conflicts among courses listed in a spreadsheet.
 *
 * Courses are in conflict if all these conditions are met:
 *   1. The courses are on the same `course date`.
 *   2. The courses times overlap
 *   3. The courses shared the same tools
 *
 * Options:
 *   action:    {string} 'show' (default)
 *   color.min: {number} The low bound for color values.
 *   color.max: {number} The upper bound for color values.
 *
 * @param {Object} [options] The configuration for this application.
 */
export function ConflictApp(options) {
  this.DATA_SHEET_NAME = 'Data'

  // a1Notation of row numbers
  this.HEADER_ROW = 1
  this.DATA_ROW = 2

  // a1Notation of column numbers
  this.COURSE_DATE = 2
  this.START_TIME = 3
  this.END_TIME = 7
  this.TOOLS = 8

  // Formulas
  this.FORMULA_END_TIME = '=C{{row}}+D{{row}}'
  this.FORMULA_TOOLS = '=vlookup(F{{row}}, Tools!$A$1:$B, 2, FALSE)'

  // Options
  this.action = (options && options.action) || 'show'
  this.minColor = (options && options.color && options.color.min) || 0xff5555
  this.maxColor = (options && options.color && options.color.max) || 0xffeeee

  // Data model
  this.Course = Course
}

/**
 * The application router.
 *
 * @return {ConflictApp} This application for chaining.
 */
ConflictApp.prototype.run = function () {
  switch (this.action) {
    case 'show':
      this.setup().getConflicts().showConflicts().teardown()
      break
    default:
      Browser.msgBox('Error: App given invalid action: ' + this.action)
  }

  return this
}

/**
 * Accesses the target spreadsheet, adds additional calculations and then loads
 * the data.
 *
 * @return {ConflictApp} This application for chaining.
 */
ConflictApp.prototype.setup = function () {
  // Get a handle to the data sheet, activate it and clear the background.
  var dSheet = SpreadsheetApp.getActive()
    .getSheetByName(this.DATA_SHEET_NAME)
    .activate()
  var dRange = dSheet.getDataRange().setBackground('white')
  var dRows = dRange.getNumRows() - this.HEADER_ROW

  // Sort the sheet, calculate End Time and Tools columns.
  dSheet.sort(this.START_TIME)
  dSheet
    .getRange(this.DATA_ROW, this.END_TIME, dRows)
    .setFormulas(
      ConflictApp._setRangeValues(
        dRows,
        1,
        this.FORMULA_END_TIME,
        this.DATA_ROW,
        0
      )
    )
  dSheet
    .getRange(this.DATA_ROW, this.TOOLS, dRows)
    .setFormulas(
      ConflictApp._setRangeValues(
        dRows,
        1,
        this.FORMULA_TOOLS,
        this.DATA_ROW,
        0
      )
    )

  // Finally, get the data! Then drop the header row.
  var dValues = dRange.getValues()
  dValues.shift()

  // Cache for later use
  this.dSheet = dSheet
  this.dValues = dValues

  return this
}

/**
 * Sorts the spreadsheet by `course date`.
 *
 * @return {ConflictApp} This application for chaining.
 */
ConflictApp.prototype.teardown = function () {
  this.dSheet.sort(this.COURSE_DATE)
  return this
}

/**
 * Return a random hex color (i.e. '#FFE45D') between `min` and `max`.
 *
 * @param  {number} min Lower bound of color value
 * @param  {number} max Upper bound of color value.
 * @return {string}     The hex color with hash sign between `min` (included)
 *                      and `max` (excluded).
 */
ConflictApp._getRandomColor = function (min, max) {
  return '#' + getRandomInt(min, max).toString(16)
}

/**
 * The callback function to Array.filter() to test each element of an array.
 * Invoked with arguments (element, index, array). Return true to keep the
 * element, false otherwise.
 *
 * In the context of this application, `._filterConflicts` returns true if
 * the `course` is in conflict with other courses in the `collection`; false
 * otherwise.
 *
 * Conflict Rules (must match all)
 *   1. `course` has a time conflict with other courses in `collection`.
 *   2. `course` shares tools with courses in time conflict.
 *
 * Notes:
 *   1. `collection` is the group of Courses with same course date.
 *   2. `collection` is sorted by course start time.
 *
 * @private
 * @param  {Course}  course     The current Course to process.
 * @param  {number}  idx        The index of `course` in `collection`.
 * @param  {array}   collection The array that holds Courses.
 * @return {boolean}            Return true if `course` is in conflict with any
 *                              other course in `collection`.
 */
ConflictApp._filterConflicts = function (course, idx, collection) {
  var courses = collection.slice(idx + 1)

  for (var i = 0; i < courses.length; i += 1) {
    if (
      course.end >= courses[i].start &&
      course.tools.some(function (tool) {
        return courses[i].tools.indexOf(tool) !== -1
      })
    ) {
      course.conflict = true
      courses[i].conflict = true
    } else {
      break
    }
  }

  /*
   * It's possible that `course` is not tagged in conflict above,
   * but it might have been tagged while processing a previous
   * courses in the group. If it's been tagged, it must be included.
   */
  return course.conflict || false
}

/**
 * Finds courses in conflicts. Then sets this application's `conflicts` property
 * the array of conflicts.
 *
 * @return {ConflictApp} This application for chaining.
 */
ConflictApp.prototype.getConflicts = function () {
  var courses = []

  this.dValues.forEach(function (row, idx) {
    courses.push(new Course(idx, row))
  })

  var coursesByDate = groupBy(courses, function (course) {
    return course.date
  })

  var color
  var conflicts = []

  // For each group, retrieves the courses in conflict and adds highlight color.
  for (var key in coursesByDate) {
    if (coursesByDate.hasOwnProperty(key)) {
      color = ConflictApp._getRandomColor(this.minColor, this.maxColor)

      conflicts = conflicts.concat(
        coursesByDate[key]
          .filter(ConflictApp._filterConflicts)
          .map(function (course) {
            course.color = color
            return course
          })
      )
    }
  }

  // Cache for later use.
  this.conflicts = conflicts

  return this
}

/*
 * Marks the conflicted courses' background color.
 *
 * @return {ConflictApp} This application for chaining.
 */
ConflictApp.prototype.showConflicts = function () {
  var _self = this
  this.conflicts.forEach(function (course) {
    _self.dSheet.getRange(course.range).setBackground(course.color)
  })

  return this
}

/**
 * Returns array of `rows` x `cols`, with `value` in each cell.
 * Use `{{row}}` and `{{col}}` in `value` contents for interpolation.
 *
 * Example:
 *
 *    '=C{{row}}+D{{col}}'
 *
 * @private
 * @param {number} rows      The number of rows to build
 * @param {number} cols      The number of columns to build
 * @param {string} value     The value to set each cell
 * @param {number} rowOffSet If `value` is being interpolated for `{{row}}`,
 *                           this sets the start value of row.
 * @param {number} colOffSet If `value` is being interpolated for `{{col}}`,
 *                           this sets the start value of col.
 * @return {Array}           A new, 2d array of values with corresponding
 *                           row/col numbers if interpolation was requested.
 */
ConflictApp._setRangeValues = function (
  rows,
  cols,
  value,
  rowOffSet,
  colOffSet
) {
  var row
  var result = []

  for (var i = 0; i < rows; i += 1) {
    row = []
    var data = value.replace(/{{row}}/g, i + rowOffSet)

    for (var j = 0; j < cols; j += 1) {
      row[j] = data.replace(/{{col}}/g, j + colOffSet)
    }

    result[i] = row
  }

  return result
}

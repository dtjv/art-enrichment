import { flattenDeep, compact } from 'lodash'
import { Config } from './config'

/**
 * App to sync the list of values in a column to the list of choices in a
 * dropdown field on a form.
 *
 * @param {Object} options Configuration for this application.
 */
export function UpdateApp(options) {
  this.CFG_SHEET_NAME = 'Configuration'

  // Options
  this.action = (options && options.action) || 'sync'

  // Defaults
  this.errors = []
  this.configs = []
}

/**
 * The App router and controller based on `action`.
 *
 * @return {UpdateApp} This app instance for chaining.
 */
UpdateApp.prototype.run = function () {
  switch (this.action) {
    case 'sync':
      this.setup().sync().teardown()
      break
    default:
      Browser.msgBox('Error: App given invalid action: ' + this.action)
  }

  return this
}

/**
 * Reads worksheet, CFG_SHEET_NAME and loads data(w/o headers)
 * into it's property array, `.configs`. Each row of the sheet
 * data is stored as a `Config`.
 *
 * Throws fatal error if it can't find the CFG_SHEET_NAME sheet.
 *
 * @return {UpdateApp} This app instance for chaining.
 */
UpdateApp.prototype.setup = function () {
  var _self = this

  // Retrieve data from spreadsheet
  var cfgValues = SpreadsheetApp.getActive()
    .getSheetByName(this.CFG_SHEET_NAME)
    .getDataRange()
    .getValues()

  // A 2d array of data. Here we drop the header row.
  cfgValues.shift()

  // Store the configuration for easier access.
  cfgValues.forEach(function (cfg) {
    _self.configs.push(new Config(cfg))
  })

  return this
}

/**
 * Retrieves an item with `itemName` on form specified by `formId`.
 *
 * @private
 * @param  {String} formId   The ID of the Google Form.
 * @param  {String} itemName The title of the item to locate.
 * @return {Item}            The Item found or null if not found.
 */
UpdateApp._getItem = function (formId, itemName) {
  var item = null
  var items = FormApp.openById(formId).getItems()

  for (var i = 0; i < items.length; i += 1) {
    if (items[i].getTitle() === itemName) {
      item = items[i]
      break
    }
  }

  return item
}

/**
 * Runs the sync process for the given configuration.
 *
 * The process is:
 *   1. find worksheet `cfg.sheet` on spreadsheet `cfg.ssID`.
 *   2. get values from column `cfg.column` on worksheet.
 *   3. find target field `cfg.field` on form `cfg.formID`.
 *   4. set values from step 2 to choices on field from step 3.
 *   5. return choices
 *
 * @private
 * @param  {Config} cfg A Config detailing instructions for the sync
 * @return {Array}      An array of values to replace list item choices.
 */
UpdateApp._processConfig = function (cfg) {
  var DATA_ROW = 2

  var srcValues = SpreadsheetApp.openById(cfg.ssID)
    .getSheetByName(cfg.sheet)
    .getRange(cfg.column + DATA_ROW + ':' + cfg.column)
    .getValues()
  var listItem = UpdateApp._getItem(cfg.formID, cfg.field).asListItem()

  srcValues = compact(flattenDeep(srcValues))
  listItem.setChoiceValues(srcValues)

  return srcValues
}

/**
 * Attempts to process each configuration, and collect errors as it goes.
 * If errors occur, the error is stored in App's own property `.errors`
 * array for reporting later.
 *
 * @return {UpdateApp} This app instance for chaining.
 */
UpdateApp.prototype.sync = function () {
  var errors = []

  for (var i = 0; i < this.configs.length; i += 1) {
    try {
      UpdateApp._processConfig(this.configs[i])
    } catch (error) {
      errors.push(error.message)
    }
  }

  this.errors = errors

  return this
}

/**
 * Display appropriate message - error or success.
 *
 * @return {UpdateApp} This app instance for chaining.
 */
UpdateApp.prototype.teardown = function () {
  if (this.errors.length) {
    Browser.msgBox('Errors: ' + this.errors.join('\n'))
  } else {
    Browser.msgBox('Update completed!')
  }

  return this
}

module.exports = UpdateApp

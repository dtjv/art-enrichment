/**
 * The data structure for UpdateApp's configurations. Each row in the
 * CFG_SHEET_NAME is mapped to an instance of `Config`.
 *
 * @param {Array} cfg The column values in the original data set for this row.
 */
function Config(cfg) {
  this.ssID   = cfg[0];
  this.sheet  = cfg[1];
  this.column = cfg[2];
  this.formID = cfg[3];
  this.field  = cfg[4];
}

module.exports = Config;

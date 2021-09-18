/**
 * The data structure for ConflictApp. Each row in the DATA_SHEET_NAME is
 * mapped to an instance of `Course`.
 *
 * @param {number} row     The row in the original data set for this course.
 * @param {Array}  columns The column values in the original data set for this row.
 */
function Course(row, columns) {
  // Adjust for a1Notation
  row += 2;

  this.range    = 'A' + row + ':H' + row;
  this.date     = columns[1];
  this.start    = columns[2];
  this.class    = columns[3];
  this.duration = columns[4];
  this.project  = columns[5];
  this.end      = columns[6];
  this.tools    = columns[7].replace(/,\s*/g, ',').split(',');
}

module.exports = Course;

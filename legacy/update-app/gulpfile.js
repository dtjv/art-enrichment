var gulp    = require('gulp');
var del     = require('del');
var fs      = require('fs');
var path    = require('path');
var pdc     = require('pdc');
var mkdirp  = require('mkdirp');
var replace = require('gulp-replace');
var copy    = require('copy-files');
var concat  = require('gulp-concat');

gulp.task('clean', function () {
  return del.sync(['./dist', './src/js/tmp']);
});

gulp.task('about', ['clean'], function () {
  const src = fs.readFileSync('./README.md', 'utf8');

  pdc(src, 'markdown', 'html5', ['-s', '--template', './src/docs/templates/template.html'], function (err, result) {
    if (err) {
      throw err;
    }

    const dest = './dist/docs';

    mkdirp.sync(dest, {mode: '0755'});
    fs.writeFileSync(path.join(dest, 'about.html'), result);
  });
});

gulp.task('copy', function () {
  copy({
    files: {
      'flatten.js': path.join(__dirname, '/node_modules/js-utils/libs/flatten.js'),
      'trim.js': path.join(__dirname, '/node_modules/js-utils/libs/trim.js')
    },
    dest: 'src/js/tmp',
    overwrite: true
  }, function () {});
});

gulp.task('build', ['clean', 'copy'], function () {
  return gulp.src(['src/js/**/*.js', '!src/js/libs/globals/**/*.js'])
    .pipe(replace(/.*require.*/g, ''))
    .pipe(replace(/module\.exports(.*\s*)*/, ''))
    .pipe(concat('code.gs'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', ['build', 'about']);

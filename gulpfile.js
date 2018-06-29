var gulp      = require('gulp'),
    bs        = require('browser-sync'),
    reload    = bs.reload,
    watch     = require('gulp-watch'),
    prefixer  = require('gulp-autoprefixer'),
    scss      = require('gulp-sass'),
    include   = require('gulp-include'),
    notify    = require('gulp-notify'),
    concatcss = require('gulp-concat-css'),
    rimraf    = require('rimraf');

var path = {
  dist: {
    html: 'dist/',
    css: 'dist/',
    static: 'dist/'
  },
  src: {
    html: 'src/**/**/**/**/**/*.html',
    scss: 'src/**/**/**/**/**/*.scss',
    static: 'src/static/**/**/**/*.*'
  },
  watch: {
    html: 'src/**/**/**/**/**/*.html',
    scss: 'src/**/**/**/**/**/*.scss',
    static: 'src/static/**/**/**/*.*'
  },
  clean: './dist'
};

var config = {
  server: {
    baseDir: "./dist"
  },
  host: 'localhost',
  port: 3000
};

gulp.task('buildHtml', function () {
  gulp.src(path.src.html)
    .pipe(include({
      includePaths: 'src/app'
      }))
    .on('error', console.log)
    .pipe(gulp.dest(path.dist.html))
    .pipe(reload({stream: true}));
});

gulp.task('buildCSS', function () {
  gulp.src(path.src.scss)
    .pipe(include())
    .on('error', console.log)
    .pipe(scss().on('error', notify.onError({
      message: "<%= error.message %>",
      title:   "CSS compilation error"
      })))
    .pipe(prefixer())
    .pipe(concatcss('bundle.css'))
    .pipe(gulp.dest(path.dist.css))
    .pipe(reload({stream: true}));
});

gulp.task('buildStatic', function() {
  gulp.src(path.src.static)
  .pipe(gulp.dest(path.dist.static))
});

gulp.task('build', [
  'buildHtml',
  'buildCSS',
  'buildStatic'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('buildHtml');
  });
  watch([path.watch.scss], function(event, cb) {
    gulp.start('buildCSS');
  });
  watch([path.watch.static], function(event, cb) {
    gulp.start('buildStatic');
  });
});

gulp.task('webserver', function () {
  bs(config);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);

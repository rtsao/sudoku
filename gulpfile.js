var gulp = require('gulp')
  , gutil = require('gulp-util')
  , plumber = require('gulp-plumber')
  , cache = require('gulp-cache')
  , imagemin = require('gulp-imagemin')
  , prefix = require('gulp-autoprefixer')
  , less = require('gulp-less')
  , jade = require('gulp-jade')
  , del = require('del')
  , source = require('vinyl-source-stream')
  , express = require('express')
  , watchify = require('watchify')

gulp.task('clean', function(cb) {
  del(['build/**/*'], cb);
});

gulp.task('jade', function() {
  gulp.src(['src/**/*.jade'])
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest('build'))
    
});

gulp.task('less', function() {
  gulp.src(['src/less/style.less'])
    .pipe(plumber())
    .pipe(less())
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('build/css'))
})

gulp.task('images', function(cb) {
  del(['build/img/**/*'], cb);
  gulp.src(['src/images/**/*'])
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('build/img'))
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.jade', ['jade'])
  gulp.watch('src/less/**/*.less', ['less'])
  gulp.watch('src/images/**/*', ['images'])

  var bundler = watchify('./src/js/app.js')
    .on('update', rebundle)

  function rebundle () {
    return bundler.bundle()
      .on('error', gutil.log)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('build/js'))
  }

  return rebundle();
});

gulp.task('server', function() {
  var server = express();
  server.use(express.static('build'));
  server.listen(2222);
});

gulp.task('default', ['jade', 'images', 'less', 'watch', 'server']);
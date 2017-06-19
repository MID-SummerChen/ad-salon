var gulp = require('gulp'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-clean-css'),
  flatten = require('gulp-flatten'),
  replace = require('gulp-replace'),
  spritesmith = require('gulp.spritesmith'),
  runSequence = require('run-sequence')
  del = require('del');

gulp.task('sprite', function () {
  var spriteData = gulp.src('static/sprites/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('static/css'));
});

gulp.task('replace', function(){
  return gulp.src(['dist/static/css/combined.css'])
    .pipe(replace('url(../fonts', 'url(/static/fonts'))
    .pipe(replace('url(fonts', 'url(/static/fonts'))
    .pipe(gulp.dest('dist/static/css'));
});

gulp.task('bundle', function () {
  return gulp.src('dist/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('dist'));
});


gulp.task('fonts', () => {
  return gulp.src('dist/static/**/*.{otf,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest('./dist/static/fonts'))
});


gulp.task('clean', function() {
  return del([
    'dist/static/bower',
    'dist/static/css/**/*',
    '!dist/static/css/sprite.css',
    '!dist/static/css/sprite.png',
    '!dist/static/css/combined.css',
    '!dist/static/css/app.*.{css,map}',
    'dist/static/js/**/*',
    '!dist/static/js/combined.js',
    '!dist/static/js/app.*.{js,map}',
    '!dist/static/js/manifest.*.{js,map}',
    '!dist/static/js/vendor.*.{js,map}',
  ]);
});


gulp.task("default",(cb)=>{
  runSequence(
    'bundle',
    ['fonts', 'replace'],
    'clean',
    cb);
})

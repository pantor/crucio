var gulp = require('gulp'),
  ngAnnotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  inlineCss = require('gulp-inline-css'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel'),
  phplint = require('gulp-phplint');


gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('js', function () {
  return gulp.src(['src/js/crucio.js','src/js/**/*.js'])
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(concat('crucio.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('js-lint', function () {
  return gulp.src(['src/js/crucio.js','src/js/**/*.js'])
    .pipe(eslint({
      extends: ['airbnb/base', 'angular'],
      rules: { 'angular/controller-as-vm': 0, 'angular/no-service-method': 0, 'angular/log': 0, 'no-param-reassign': 1, 'prefer-arrow-callback': 0, 'arrow-body-style': 0 },
      envs: ['browser', 'es6'],
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('js-vendor', function () {
  return gulp.src([
    'src/js-vendor/spin.min.js',
    'src/js-vendor/Chart.min.js',
    'src/js-vendor/angular.min.js',
    'src/js-vendor/textAngular.min.js',
    'src/js-vendor/**/*.js',
  ])
    .pipe(concat('vendor.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('mail', function () {
  return gulp.src('src/mail-templates/**/*.html')
    .pipe(inlineCss())
    .pipe(gulp.dest('api/mail-templates/'));
});

gulp.task('php', function () {
  gulp.src('api/v1/**/*.php')
    .pipe(phplint());
});

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/mail-templates/**/*.html', ['mail']);
  gulp.watch('api/v1/**/*.php', ['php']);
});

gulp.task('default', ['watch']);

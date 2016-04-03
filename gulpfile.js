var gulp = require('gulp'),
  ts = require('gulp-typescript'),
  ngAnnotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  inlineCss = require('gulp-inline-css'),
  phplint = require('gulp-phplint');


gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('ts', function () {
  gulp.src(['src/ts/crucio.ts', 'src/ts/**/*.ts'])
		.pipe(ts({
      noImplicitAny: false,
			out: 'crucio.js',
		}))
    .pipe(ngAnnotate())
    .pipe(uglify())
		.pipe(gulp.dest('public/js'));
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
  gulp.watch('src/ts/**/*.ts', ['ts']);
  gulp.watch('src/mail-templates/**/*.html', ['mail']);
  gulp.watch('api/v1/**/*.php', ['php']);
});

gulp.task('default', ['watch']);

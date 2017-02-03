var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  copy = require('gulp-copy'),
  inlineCss = require('gulp-inline-css'),
  ngAnnotate = require('gulp-ng-annotate'),
  phplint = require('gulp-phplint'),
  sass = require('gulp-sass'),
  ts = require('gulp-typescript'),
  uglify = require('gulp-uglify'),
  streamqueue = require('streamqueue');


var api = 'api/';
var app = 'app/';
var node = 'node_modules/';

gulp.task('sass', function () {
  return streamqueue({ objectMode: true },
      gulp.src([
        node + 'angular-loading-bar/build/loading-bar.min.css',
        node + 'bootstrap/dist/css/bootstrap.min.css',
        node + 'font-awesome/css/font-awesome.min.css',
        node + 'angularjs-slider/dist/rzslider.min.css',
        node + 'ng-tags-input/build/ng-tags-input.min.css',
        node + 'textangular/dist/textAngular.css',
      ]),
      gulp.src([app + '**/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    )
    .pipe(concat('crucio.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('tsc', function () {
  gulp.src([
    app + 'crucio.ts',
    app + '**/*.ts',
  ])
    .pipe(ts({ noImplicitAny: false, out: 'crucio.js' }))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('js-vendor', function () {
  gulp.src([
    node + 'spin.js/spin.min.js',
    node + 'angular/angular.min.js',
    node + 'textangular/dist/textAngular-rangy.min.js',
    node + 'textangular/dist/textAngular-sanitize.min.js',
    node + 'textangular/dist/textAngular.min.js',
    node + 'textangular/dist/textAngularSetup.js',
    node + 'angular-cookies/angular-cookies.min.js',
    node + 'angular-file-upload/dist/angular-file-upload.min.js',
    node + 'angular-messages/angular-messages.min.js',
    node + 'angular-ui-router/release/angular-ui-router.min.js',
    node + 'angular-scroll/angular-scroll.min.js',
    node + 'angular-spinner/angular-spinner.min.js',
    node + 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    node + 'angularjs-slider/dist/rzslider.min.js',
    node + 'ng-tags-input/build/ng-tags-input.min.js',
  ])
    .pipe(concat('vendor.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));

  gulp.src([
    node + 'jquery/dist/jquery.min.js',
    node + 'jquery-validation/dist/jquery.validate.js',
    node + 'js-cookie/src/js.cookie.js',
    node + 'bootstrap/dist/js/bootstrap.min.js',
  ])
    .pipe(concat('outer.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('mail', function () {
  gulp.src(app + 'mail-templates/**/*.html')
    .pipe(inlineCss())
    .pipe(gulp.dest(api + 'mail-templates/'));
});

gulp.task('php', function () {
  gulp.src(api + '**/*.php')
    .pipe(phplint());
});

gulp.task('fonts', function () {
  gulp.src([
    node + 'font-awesome/fonts/*.*'
  ])
    .pipe(copy('public/fonts', { prefix: 3 }));
});

gulp.task('watch', function () {
  gulp.watch(api + '**/*.php', ['php']);
  gulp.watch(app + '**/*.scss', ['sass']);
  gulp.watch(app + '**/*.ts', ['tsc']);
  gulp.watch(app + 'mail-templates/**/*.html', ['mail']);
});

gulp.task('default', ['watch']);

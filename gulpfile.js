const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  copy = require('gulp-copy'),
  inlineCss = require('gulp-inline-css'),
  phplint = require('gulp-phplint'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  streamqueue = require('streamqueue'),
  shell = require('gulp-shell');


const api = 'api/';
const app = 'app/';
const node = 'node_modules/';

gulp.task('sass', function () {
  return streamqueue({ objectMode: true },
      gulp.src([
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

gulp.task('webpack', shell.task([
  'webpack'
]));

gulp.task('js-vendor', function () {
  gulp.src([
    node + 'jquery/dist/jquery.min.js',
    node + 'jquery-validation/dist/jquery.validate.js',
    node + 'js-cookie/src/js.cookie.js',
    node + 'bootstrap/dist/js/bootstrap.min.js',
  ])
    .pipe(concat('outer.js'))
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
  gulp.watch(app + '**/*.ts', ['webpack']);
  gulp.watch(app + 'mail-templates/**/*.html', ['mail']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['webpack', 'js-vendor', 'sass', 'mail', 'fonts']);

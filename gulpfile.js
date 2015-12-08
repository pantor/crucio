var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    inlineCss = require('gulp-inline-css'),
    eslint = require('gulp-eslint')
    babel = require('gulp-babel'),
    sourcemaps = require("gulp-sourcemaps"),
    phplint = require('phplint').lint,
    convertEncoding = require('gulp-convert-encoding');


// Compile SASS
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/css/'));
});

// Lint and format JS
gulp.task('js', function () {
    return gulp.src(['src/js/crucio.js', 'src/js/**/*.js'])
        .pipe(eslint({
            globals: {
                '$': true,
                'angular': true,
                'subject_list': true,
            },
            extends: ['airbnb/base', 'angular'], // 'eslint:recommended'
            rules: {
                'angular/controller-as-vm': 0,
                'angular/no-service-method': 0,
                'angular/document-service': 0,
                'angular/log': 0,
                'no-console': 1,
                'camelcase': 0,
                'no-loop-func' : 1,
                'eqeqeq': 0,
                'func-names': 0,
                'indent': [2, 4],
            },
            envs: ['browser', 'es6'],
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat('crucio.js'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(convertEncoding({ to: 'iso-8859-15' }))
        .pipe(gulp.dest('public/js/'));
});

// Compile mail templates
gulp.task('mail', function () {
    return gulp.src('src/mail-templates/**/*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('api/mail-templates/'));
});

// Lint PHP
gulp.task('php', function (cb) {
    return phplint(['api/v1/**/*.php'], { stderr: true }, function (err, stdout, stderr) {
        if (err) {
            cb(err);
        } else {
            cb();
        }
    });
});

// Watch Files For Changes
gulp.task('serve', function () {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/mail-templates/**/*.html', ['mail']);
    gulp.watch('api/v1/**/*.php', ['php']);
});

// Default Task
gulp.task('default', ['serve']);
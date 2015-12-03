var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	concat = require("gulp-concat"),
	inlineCss = require('gulp-inline-css'),
	jshint = require('gulp-jshint'),
	phplint = require('phplint').lint,
	convertEncoding = require('gulp-convert-encoding');


// Compile SASS
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/css/'));
});

// Lint and format JS
gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
	    .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
    	.pipe(concat('crucio.js'))
    	.pipe(uglify({ mangle: false }))
    	.pipe(rename({ suffix: '.min' }))
    	.pipe(convertEncoding({to: 'iso-8859-15'}))
		.pipe(gulp.dest('public/js/'));
});

// Compile mail templates
gulp.task('mail', function() {
	return gulp.src('src/mail-templates/**/*.html')
    	.pipe(inlineCss())
		.pipe(gulp.dest('public/mail-templates/'));
});

// Lint PHP
gulp.task('php', function(cb) {
    return phplint(['api/v1/**/*.php'], {stderr: true}, function (err, stdout, stderr) {
        if (err) {
            cb(err);
        } else {
            cb();
        }
    });
});

// Watch Files For Changes
gulp.task('serve', function() {
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/mail-templates/**/*.html', ['mail']);
	gulp.watch('api/v1/**/*.php', ['php']);
});

// Default Task
gulp.task('default', ['serve']);
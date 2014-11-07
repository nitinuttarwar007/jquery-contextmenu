var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename');

gulp.task('compile', function(){
    return gulp.src('./src/*.coffee')
               .pipe(coffee({bare: true}))
	       .on('error', function(error){
	           notify.onError(error.message).apply(this);
		   this.emit('end');
	       })
	       .pipe(gulp.dest('./'))
	       .pipe(uglify())
	       .pipe(rename({suffix: '.min'}))
	       .pipe(gulp.dest('./'))
	       .pipe(notify("Compiled  <%= file.relative %>"));
});

gulp.task('watch', function(){
   return gulp.watch('./src/*.coffee',['compile']);
});

gulp.task('default',['watch']);

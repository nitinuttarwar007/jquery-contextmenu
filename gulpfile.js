var gulp = require('gulp'),
    pack = require('path').join(process.cwd(), 'package.json'),
    $ = require('gulp-load-plugins')({
        pattern : 'gulp-*',
        config: pack,
        scope: ['devDependencies'],
        replaceString: 'gulp-',
        camelize: true,
        lazy: true
    });

gulp.task('compile', function(){
    return gulp.src('./src/*.coffee')
           .pipe($.coffeelint())
           .pipe($.coffeelint.reporter())
           .pipe($.coffee({bare: true}))
           .on('error', $.util.log)
	       .pipe(gulp.dest('./'))
	       .pipe($.uglify())
	       .pipe($.rename({suffix: '.min'}))
	       .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
   return gulp.watch('./src/*.coffee',['compile']);
});

gulp.task('default',['watch']);

var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
 
gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});
 
gulp.task('default', ['clean'], function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            module: 'commonjs'
        }))
        .pipe(gulp.dest('build'));
});
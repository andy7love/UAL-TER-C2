var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var tsProject = ts.createProject('./tsconfig.json');
 
gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});
 
gulp.task('default', ['clean'], function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('build'));
});
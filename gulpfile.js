const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', () => {
    return del(['./out']);
});

gulp.task('build', () => {
    return gulp.src('./src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts.createProject('tsconfig.json')())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./out'));
});

gulp.task('default', ['clean', 'build']);

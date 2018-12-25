const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");

let tsProject = ts.createProject("tsconfig.json");

function build() {
    return gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("/"))
        .pipe(gulp.dest("dist/"));
}

function watch() {
    return gulp.watch("src/*.ts", build);
}

exports.build = build;
exports.watch = watch;
exports.default = build;

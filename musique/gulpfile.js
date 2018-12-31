const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");

let tsProject = ts.createProject("tsconfig.json");

function build() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("/"))
        .pipe(gulp.dest("dist/"));
}

exports.build = build;
exports.default = build;

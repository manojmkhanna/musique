const gulp = require("gulp");
const del = require("del");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");

const tsProject = ts.createProject("./tsconfig.json");

gulp.task("clean", () => {
    return del(["./dist"]);
});

gulp.task("build", () => {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist"))
});

gulp.task("watch", ["build"], () => {
    return gulp.watch("./src/**/*.ts", ["build"]);
});

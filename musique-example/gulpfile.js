const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const nodemon = require("gulp-nodemon");

gulp.task("build", () => {
    let tsProject = ts.createProject("tsconfig.json");

    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"))
});

gulp.task("start", ["build"], () => {
    return nodemon({
        watch: "src",
        ext: "ts",
        tasks: ["build"]
    });
});

gulp.task("default", ["start"]);

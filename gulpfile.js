var gulp         = require("gulp"),
    sourcemaps   = require("gulp-sourcemaps"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    del          = require("del")

// Compile SCSS files to CSS
gulp.task("scss", function () {
    del(["themes/danesis/static/css/**/*"])
    gulp.src("scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole : true}))
        .pipe(autoprefixer({browsers : ["last 20 versions"]}))
        .pipe(sourcemaps.write())
        .pipe(hash())
        .pipe(gulp.dest("themes/danesis/static/css"))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/styles"))
})

// Watch SCSS folder for changes
gulp.task("watch", function () {
    gulp.watch("scss/**/*", ["scss"])
})

// Set SCSS compiling as default task
gulp.task("default", ["watch"])
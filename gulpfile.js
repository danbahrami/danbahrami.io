var gulp         = require("gulp"),
    sourcemaps   = require("gulp-sourcemaps"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    hash         = require("gulp-hash"),
    del          = require("del")

// Compile SCSS files to CSS
gulp.task("scss", function () {
    del(["themes/danesis/static/css/**/*"])
    gulp.src("src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole : true,
            outputStyle     : "compressed"
        }))
        .pipe(autoprefixer({browsers : ["last 20 versions"]}))
        .pipe(sourcemaps.write())
        .pipe(hash())
        .pipe(gulp.dest("themes/danesis/static/css"))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/styles"))
})

gulp.task("images", function () {
    del(["themes/danesis/static/images/**/*"])
    gulp.src("src/images/**/*")
        .pipe(hash())
        .pipe(gulp.dest("themes/danesis/static/images"))
        .pipe(hash.manifest("hash.json"))
        .pipe(gulp.dest("data/images"))
})

// Watch asset folder for changes
gulp.task("watch", function () {
    gulp.watch("src/scss/**/*", ["scss"])
    gulp.watch("src/images/**/*", ["images"])
})

// Set SCSS compiling as default task
gulp.task("default", ["watch"])
var gulp         = require("gulp"),
    sourcemaps   = require("gulp-sourcemaps"),
    sass         = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer")

// Compile SCSS files to CSS
gulp.task("scss", function () {
    gulp.src("scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole : true}))
        .pipe(autoprefixer({browsers : ["last 20 versions"]}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("themes/danesis/static/css"))
})

// Watch SCSS folder for changes
gulp.task("watch", function () {
    gulp.watch("scss", ["scss"])
})

// Set SCSS compiling as default task
gulp.task("default", ["watch"])
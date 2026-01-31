const gulp = require('gulp');
const connect = require('gulp-connect');

// Local server with live reload
function server() {
    connect.server({
        root: './',
        port: 3000,
        livereload: true
    });
}

// Watch files and reload
function watch() {
    gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js', 'images/**/*.{png,jpg,svg}']).on('change', (file) => {
        gulp.src(file.path)
            .pipe(connect.reload());
    });
}

// Build tasks for deployment
function copyHtml() {
    return gulp.src('*.html')
        .pipe(gulp.dest('dist'));
}

function copyCss() {
    return gulp.src('css/**/*.css')
        .pipe(gulp.dest('dist/css'));
}

function copyJs() {
    return gulp.src('js/**/*.js')
        .pipe(gulp.dest('dist/js'));
}

function copyImages() {
    return gulp.src('images/**/*.{png,jpg,jpeg,svg,gif,webp}')
        .pipe(gulp.dest('dist/images'));
}

// Clean dist folder
async function clean() {
    const { deleteAsync } = await import('del');
    return deleteAsync(['dist']);
}

// Default task
exports.default = gulp.parallel(server, watch);

// Build task - copies all files to dist folder
exports.build = gulp.series(
    clean,
    gulp.parallel(copyHtml, copyCss, copyJs, copyImages)
);

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

// Default task
exports.default = gulp.parallel(server, watch);
exports.build = function(done) {
    console.log('Build completed!');
    done();
};

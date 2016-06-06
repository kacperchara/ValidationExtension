var gulp = require('gulp'),
    compass = require('gulp-compass'),
    minifyCSS = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename');

function error_handler (error) {
    console.log(error.toString());
    this.emit('end');
}

var CONFIG = {
    src: {
        sass: 'src/sass/',
        js: 'src/js/',
        img: 'src/img/'
    },
    destination: {
        demo: {
            css: {
                dir : 'demo/css/'
            },
            js: {
                dir : 'demo/js/'
            }
        },
        dist: {
            css: {
                dir : 'dist/css/'
            },
            js: {
                dir : 'dist/js/'
            }
        }
    }
};

gulp.task('css', function () {
    /* Generate to demo directory */
    gulp.src(CONFIG.src.sass + '*.scss')
        .pipe(compass({
            css: CONFIG.destination.demo.css.dir,
            sass: CONFIG.src.sass,
            relative: true,
            bundle_exec: true
        }))
        .on('error', error_handler)
        .pipe(gulp.dest(CONFIG.destination.demo.css.dir))
        .pipe(notify({ message: 'Finished css task for demo directory'}));

    /* Generate to dist directory */
    gulp.src(CONFIG.src.sass + 'validation-extension.scss')
        .pipe(compass({
            css: CONFIG.destination.dist.css.dir,
            sass: CONFIG.src.sass,
            relative: true,
            bundle_exec: true
        }))
        .on('error', error_handler)
        .pipe(minifyCSS())
        .pipe(gulp.dest(CONFIG.destination.dist.css.dir))
        .pipe(notify({ message: 'Finished css task for dist directory'}));
});

gulp.task('js', function () {
    gulp.src([
            CONFIG.src.js + 'vendor/jquery-1.12.3.min.js',
            CONFIG.src.js + 'vendor/jquery.validate.js',
            CONFIG.src.js + 'vendor/jquery.validate.additional-methods.js',
            CONFIG.src.js + 'vendor/jquery.selectric.min.js',
            CONFIG.src.js + 'vendor/icheck.min.js',
            CONFIG.src.js + 'validation-extension.js'
        ])
        .pipe(gulp.dest(CONFIG.destination.demo.js.dir))
        .pipe(notify({ message: 'Finished js task for demo directory'}));

    gulp.src([CONFIG.src.js + 'validation-extension.js'])
        .pipe(gulp.dest(CONFIG.destination.dist.js.dir))
        .pipe(uglify())
        .pipe(rename('validation-extension.min.js'))
        .pipe(gulp.dest(CONFIG.destination.dist.js.dir))
        .pipe(notify({ message: 'Finished js task for dist directory'}));
});

gulp.task('default', function() {
    gulp.run('css');
    gulp.run('js');
});

gulp.task('dev', function() {
    gulp.watch(CONFIG.src.sass + '**/*.scss', function () {
        gulp.run('css');
    });
    gulp.watch(CONFIG.src.js + '**/*.js', function () {
        gulp.run('js');
    });
});

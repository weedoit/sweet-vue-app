const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const tpl2js = require('gulp-vue-template2js');
const wrapper = require('gulp-wrapper');
const connect = require('gulp-connect');
const include = require('gulp-include');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const addsrc = require('gulp-add-src');

const includeParams = {
    includePaths: [`${__dirname}/node_modules`]
};

gulp.task('babel', () => {
    return gulp.src([
        'src/app/framework/**/*.js',
        'src/app/providers/**/*.js',
        'src/app/components/**/*.js',
        'src/app/pages/**/*.js',
        'src/app/routes/**/*.js',
        'src/app/app.js',
        'src/index.js',
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(tpl2js())
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: [
                '@babel/plugin-proposal-class-properties'
            ]
        }))
        .pipe(addsrc('node_modules/@babel/polyfill/dist/polyfill.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload());
});

gulp.task('sass', () => {
    return gulp.src([
        'src/app/app.scss',
        'src/app/components/**/*.scss',
        'src/app/pages/**/*.scss',
    ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('vendor-js', () => {
    return gulp.src('src/vendor.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(include(includeParams))
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'))
        .pipe(connect.reload());
});

gulp.task('vendor-sass', () => {
    return gulp.src('src/vendor.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(include(includeParams))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css/'))
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(['src/index.js', 'src/app/**/*.js', 'src/app/**/*.html'], gulp.parallel(['babel']));
    gulp.watch(['src/app/**/*.scss'], gulp.parallel(['sass']));
    gulp.watch('src/vendor.js', gulp.parallel(['vendor-js']));
    gulp.watch('src/vendor.scss', gulp.parallel(['vendor-sass']));
});

gulp.task('connect', () => {
    connect.server({
        root: 'public',
        port: 3000,
        livereload: true,
        fallback: 'public/index.html'
    });
});

gulp.task('default', gulp.parallel(['vendor-sass', 'vendor-js', 'babel', 'sass', 'watch', 'connect']));
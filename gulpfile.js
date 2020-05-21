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
const filter = require('gulp-filter');
const includeParams = { includePaths: [`${__dirname}/node_modules`] };
const joinVendor = require('./lib/gulp-join-vendor.js');
const removeUselessComponents = require('./lib/gulp-remove-useless.js');
const removeUselessModifiers = require('./lib/gulp-remove-modifier-css.js');

gulp.task('babel', () => {
    return gulp.src([
        'src/framework/**/*.js',
        'src/app/filters/**/*.js',
        'src/app/providers/**/*.js',
        'src/app/components/**/*.js',
        'src/app/pages/**/*.js',
        'src/app/routes/**/*.js',
        'src/app/app.js',
        'src/index.js',
    ])
        .pipe(plumber())
        .pipe(removeUselessComponents())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(tpl2js())
        .pipe(concat('app.js'))
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        }))
        .pipe(addsrc('node_modules/@babel/polyfill/dist/polyfill.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/bundles'))
        .pipe(connect.reload());
});

gulp.task('sass', () => {
    return gulp.src([
        'src/app/app.scss',
        'src/app/components/**/*.scss',
        'src/app/pages/**/*.scss',
    ])
        .pipe(plumber())
        .pipe(removeUselessComponents())
        .pipe(removeUselessModifiers())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/bundles/'))
        .pipe(connect.reload());
});

gulp.task('vendor', () => {
    const jsFilter = filter('**/*.js', {restore: true});
    const sassFilter = filter('**/*.scss', {restore: true});

    return gulp.src(['src/**.js', 'src/**.scss'])
        .pipe(plumber())
        .pipe(removeUselessComponents())
        .pipe(joinVendor('vendor'))
        .pipe(sourcemaps.init())
        .pipe(include(includeParams))
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(sassFilter)
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sassFilter.restore)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/bundles/'));
});

gulp.task('watch', () => {
    gulp.watch(['src/index.js', 'src/app/**/*.js', 'src/app/**/*.html', 'src/framework/**/*.js'], gulp.parallel(['babel', 'sass', 'vendor']));
    gulp.watch(['src/app/**/*.scss'], gulp.parallel(['sass', 'vendor']));
});

gulp.task('connect', () => {
    connect.server({
        root: 'public',
        port: 3000,
        livereload: true,
        fallback: 'public/index.html'
    });
});

gulp.task('default', gulp.parallel(['vendor', 'babel', 'sass', 'watch', 'connect']));
gulp.task('build', gulp.parallel(['vendor', 'babel', 'sass']));
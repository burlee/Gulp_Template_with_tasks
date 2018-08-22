const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const change = require('gulp-changed');
const htmlReplace = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const del = require('del');
const sequence = require('run-sequence');

gulp.task('reload', () => {
    browserSync.reload();
});

gulp.task('serve', ['sass'], () => {
    browserSync({
        server: 'src'
    });

    gulp.watch('src/*.html', ['reload']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('sass', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream())
});

gulp.task('cssClean', ()=>{
    return gulp.src('src/css/**/*.css')
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
})

gulp.task('js', ()=>{
    return gulp.src('src/scripts/**/*.js')
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('img', () => {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
        .pipe(change('dist/img'))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
})

gulp.task('html', ()=>{
    return gulp.src('src/*.html')
        .pipe(htmlReplace({
            'css': 'css/style.css',
            'js': 'js/script.js'
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/'))
})

gulp.task('clean', () =>{
    return del(['dist']);
})
gulp.task('build', ()=>{
    sequence('clean', ['html', 'js', 'img', 'cssClean'])
})

gulp.task('default', ['serve']);
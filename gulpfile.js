const { src, dest, task, series, watch, parallel } = require("gulp");
const rm = require("gulp-rm");
const sass = require('gulp-dart-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

const { DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS } = require('./gulp.config');

task("clean", () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm())
});

task("copy:html", () => {
  return src(`${SRC_PATH}/*.html`).pipe(dest(DIST_PATH)).pipe(reload({ stream: true }));
});

task('styles', () => {
  return src([...STYLES_LIBS, `${SRC_PATH}/css/main.scss`])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(env === "prod", (cleanCSS())))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

const libs = [
  "node_modules/jquery/dist/jquery.js",
];

task('scripts', () => {
  return src(`${SRC_PATH}/js/*.js`)
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat('main.min.js', { newLine: ';' }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulpif(env === "prod", uglify()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task("icons", () => {
  return src(`${SRC_PATH}/img/*.svg`)
    .pipe(
      svgo({
        // plugins: [
        //   {
        //     removeAttrs: { attrs: "(width|height|data.*)" }
        //   }
        // ]
      })
    )
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/img`))
    .pipe(reload({ stream: true }));
});

const images = [
  `${SRC_PATH}/img/*.{png,jpg}`,
  `${SRC_PATH}/img/vector.svg`,
  `${SRC_PATH}/img/about-shape.svg`,
  `${SRC_PATH}/img/rectangle.svg`,
  `${SRC_PATH}/img/arrow.svg`,
  `${SRC_PATH}/img/ellipse.svg`,
  `${SRC_PATH}/img/Rectangle13.svg`,
  `${SRC_PATH}/img/Polygon2.svg`,
  `${SRC_PATH}/img/checkmark.svg`,
  `${SRC_PATH}/img/marker.svg`
];

task("images", () => {
  return src(images)
    .pipe(dest(`${DIST_PATH}/img`))
    .pipe(reload({ stream: true }));
});

task("video", () => {
  return src(`${SRC_PATH}/video/*.mp4`)
 .pipe(dest(`${DIST_PATH}/video`))
 .pipe(reload({ stream: true }));
});

task('server', () => {
  browserSync.init({
    server: {
      baseDir: DIST_PATH
    },
    open: false
  });
});
task("watch", () => {
  watch(`${SRC_PATH}/styles/**/*.scss`, series("styles"));
  watch(`${SRC_PATH}/*.html`, series("copy:html",));
  watch(`${SRC_PATH}/js/*.js`, series("scripts"));
  watch(`${SRC_PATH}/img/*.svg`, series("icons"));
  watch(`${SRC_PATH}/img/*.{png,jpg}`, series("images"));
});

task(
  "default",
  series(
    "clean",
    parallel("copy:html", "styles", "scripts", "icons", "images", "video"),
    parallel("watch", "server")
  )
);

task(
  "build",
  series(
    "clean",
    parallel("copy:html", "styles", "scripts", "icons", "images", "video"),
  )
);
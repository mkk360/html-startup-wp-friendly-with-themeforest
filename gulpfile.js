const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const argv = require("minimist")(process.argv.slice(2));
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const csso = require("gulp-csso");
const del = require("del");
const gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const beautify = require("gulp-beautify-code");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const purgecss = require("gulp-purgecss");
const nunjucks = require("gulp-nunjucks");
const rendeNun = require("gulp-nunjucks-render");
const data = require("gulp-data");
const lineec = require("gulp-line-ending-corrector");
const replace = require("gulp-replace");

const paths = {
  root: "./",
  html: "./app/*.+(html|njk)",
  partialFiles: "./app/templates/**/*.+(htm|njk)",
  partial: "./app/templates/",
  php: "./app/**/*.php",
  fonts: "./app/fonts/**/*.*",
  js: "./app/js/**/*.js",
  css: "./app/css/**/*.css",
  scss: "./app/sass/**/*.scss",
  img: "./app/img/**/*.+(png|jpg|gif|ico|svg|xml|json)",
  data: "./app/data/data.json",
  assets: "./app/assets/**/*.*",
  extra: "./app/extra/**/*",
  plugin: {
    js: "./app/plugin/js/*.js",
    css: "./app/plugin/css/*.css",
  },
};

const destination = argv.clean ? "demo/" : argv.pub ? "dist/" : "dev/";
const port = argv.demo ? 4002 : argv.pub ? 4003 : 4001;
const sourcemap = argv.demo ? false : argv.pub ? true : true;
const minImg = argv.demo ? false : argv.pub ? true : false;

const dest = {
  css: `${destination}assets/css/`,
  scss: `${destination}assets/sass/`,
  js: `${destination}assets/js/`,
  fonts: `${destination}assets/fonts/`,
  php: destination,
  img: `${destination}assets/img/`,
  assets: `${destination}assets/`,
};

function browserReload(done) {
  browserSync.init({
    notify: false,
    server: {
      baseDir: destination,
    },
    port: port,
  });
  done();
}

function clean() {
  return del([destination]);
}

function customPlumber([errTitle]) {
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass",
    }),
  });
}

function html() {
  delete require.cache[require.resolve(paths.data)];
  return gulp
    .src([paths.html])
    .pipe(data(() => require(paths.data)))
    .pipe(
      rendeNun({
        path: [paths.partial],
      })
    )
    .pipe(customPlumber("Error Running Nunjucks"))
    .pipe(
      beautify({
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 0,
        unformatted: ["code", "pre", "em", "strong", "span", "i", "b", "br"],
      })
    )
    .pipe(replace(/(src|href)="(js|css)(\/[^"]*)"/g, '$1="assets/$2$3"'))
    .pipe(gulp.dest(destination))
    .pipe(browserSync.reload({ stream: true }));
}

function cssCopy() {
  return gulp
    .src([paths.css])
    .pipe(gulp.dest(dest.css))
    .pipe(browserSync.reload({ stream: true }));
}

function jsCopy() {
  return gulp
    .src([paths.js])
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.reload({ stream: true }));
}

function copyExtra() {
  return gulp
    .src([paths.extra], { base: "./app/extra/" })
    .pipe(gulp.dest(destination));
}

function scss() {
  return gulp
    .src([paths.scss])
    .pipe(gulpif(sourcemap, sourcemaps.init()))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(
      gulpif(
        argv.demo,
        csso({
          restructure: false,
          sourceMap: true,
          debug: true,
        })
      )
    )
    .pipe(lineec())
    .pipe(rename("style.css"))
    .pipe(gulpif(sourcemap, sourcemaps.write("./")))
    .pipe(gulp.dest(dest.css))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

var separator = "\n/*====================================*/\n\n";

function pluginCss() {
  return gulp
    .src(paths.plugin.css)
    .pipe(changed(dest.css))
    .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe(concat("assets.css", { newLine: separator }))
    .pipe(beautify())
    .pipe(gulp.dest(dest.css))
    .pipe(cleanCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(gulpif(sourcemap, sourcemaps.write("./maps/")))
    .pipe(lineec())
    .pipe(gulp.dest(dest.css))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function pluginJs() {
  return gulp
    .src(paths.plugin.js)
    .pipe(changed(dest.js))
    .pipe(concat("assets.js", { newLine: separator }))
    .pipe(beautify())
    .pipe(gulp.dest(dest.js))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(lineec())
    .pipe(gulp.dest(dest.js))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function sassCopy() {
  return gulp
    .src([paths.scss])
    .pipe(gulpif(argv.pub, gulp.dest(dest.assets + "sass/")))
    .pipe(gulpif(argv.demo, gulp.dest(dest.assets + "sass/")))
    .pipe(gulpif(!argv.demo && !argv.pub, gulp.dest(dest.assets + "sass/")));
}

function imgmin() {
  return gulp
    .src([paths.img])
    .pipe(changed(dest.img))
    .pipe(
      gulpif(
        minImg,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
        ])
      )
    )
    .pipe(gulp.dest(dest.img))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function fonts() {
  return gulp
    .src([paths.fonts])
    .pipe(gulpif(argv.pub, gulp.dest(dest.assets + "fonts/")))
    .pipe(gulpif(argv.demo, gulp.dest(dest.assets + "fonts/")))
    .pipe(gulpif(!argv.demo && !argv.pub, gulp.dest(dest.assets + "fonts/")));
}

function assets() {
  return gulp
    .src([paths.assets])
    .pipe(changed(dest.assets))
    .pipe(gulp.dest(dest.assets));
}

function php() {
  return gulp
    .src(paths.php)
    .pipe(gulp.dest(destination + "./"))
    .pipe(browserSync.reload({ stream: true }));
}

function watchFiles() {
  gulp.watch(paths.html, html);
  gulp.watch(paths.partial, html);
  gulp.watch(paths.data, html);
  gulp.watch(paths.img, imgmin);
  gulp.watch(paths.fonts, fonts);
  gulp.watch(paths.assets, assets);
  gulp.watch(paths.plugin.js, pluginJs);
  gulp.watch(paths.plugin.css, pluginCss);
  gulp.watch(paths.scss, scss);
  gulp.watch(paths.scss, sassCopy);
  gulp.watch(paths.css, cssCopy);
  gulp.watch(paths.js, jsCopy);
  gulp.watch(paths.php, php);
  gulp.watch(paths.extra, copyExtra);
  gulp.watch(paths.root, gulp.series(clean, build));
}

const build = gulp.series(
  clean,
  html,
  gulp.parallel(
    scss,
    fonts,
    php,
    jsCopy,
    cssCopy,
    sassCopy,
    assets,
    pluginCss,
    pluginJs,
    imgmin,
    copyExtra // Add copyExtra to the list of tasks
  )
);
const buildWatch = gulp.series(build, browserReload, gulp.parallel(watchFiles));
const watchSrc = [
  paths.html,
  paths.js,
  paths.php,
  paths.img,
  paths.fonts,
  paths.plugin.css,
  paths.plugin.css,
  paths.plugin,
  paths.data,
  paths.css,
  paths.extra,
];

exports.html = html;
exports.imgmin = imgmin;
exports.browserReload = browserReload;
exports.assets = assets;
exports.pluginJs = pluginJs;
exports.pluginCss = pluginCss;
exports.scss = scss;
exports.sassCopy = sassCopy;
exports.php = php;
exports.fonts = fonts;
exports.css = cssCopy;
exports.js = jsCopy;
exports.clean = clean;
exports.build = build;
exports.buildWatch = buildWatch;
exports.watchFiles = watchFiles;
exports.watchSrc = watchSrc;
exports.default = gulp.series(copyExtra, buildWatch);

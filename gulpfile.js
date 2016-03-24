/**
 * Web Care-Package
 * Copyright 2015 Santiago Serna. Todos los derechos reservados.
 */

// Requeridos
var gulp = require('gulp');
var gulpif = require('gulp-if');

var postcss = require('gulp-postcss');
var stylus = require('gulp-stylus');
var cssnano = require('gulp-cssnano');
var uncss = require('gulp-uncss');
var autoprefixer = require('autoprefixer');
var rucksack = require('rucksack-css');

var htmlmin = require('gulp-htmlmin');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');

var del = require('del');
var newer = require('gulp-newer');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var smoosher = require('gulp-smoosher');
var useref = require('gulp-useref');
var runSequence = require('run-sequence');

var imagemin = require('gulp-imagemin');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

/** 
 * Por defecto el Care-Package cuenta con una estructura de proyecto estandar,
 * las rutas para los archivos que seran procesados se almacenan en la variable
 * config. Si desea usar una estructura de proyecto diferente es necesario
 * modificar las rutas de los archivos de la variable config segun la estructura
 * de su proyecto (se recomienda usar la estructura estandar).
 */

/**
 * IMPORTANTE: El Care-Package usa Jade como motor de templates y pre-procesador
 * de HTML y PostCSS junto con Stylus como pre-procesador de CSS.
 */

// Lint JavaScript: lee el codigo JS y verifica si tiene errores.
gulp.task('lint', function() {
  gulp.src(['app/scripts/**/*.js', '!app/scripts/vendors/**'])
  .pipe(eslint({
    'rules': {
      'camelcase': 1,
      'curly': 1,
      'eqeqeq': 0,
      'indent': [2, 4],
      'max-len': 0,
      'max-nested-callbacks': [1, 10],
      'no-alert': 0,
      'no-empty': 1,
      'no-use-before-define': 0,
      'no-obj-calls': 2,
      'no-unused-vars': 0,
      'one-var': [2, "always"],
      'padded-blocks': [2, "always"],
      'quotes': 0,
      'semi': 1,
      'space-before-blocks': [1, "always"],
      'space-before-function-paren': [2, "always"],
      'no-multiple-empty-lines': 0,
      'wrap-iife': [2, "outside"]
    },
    'globals': {
      '$': false,
      'document': false,
      'window': false,
      'navigator': false,
      'Waypoint': false,
      'Modernizr': false
    }
  }))
  .pipe(eslint.format())
  .pipe(gulpif(!browserSync.active, eslint.failOnError()));
});

// Image task: optimizar imagenes.
gulp.task('images', function() {
  gulp.src(['app/img/**/*.png', 'app/img/**/*.jpg'])
  .pipe(imagemin({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('dist/img'))
  .pipe(size({title: 'images'}));
});

// Copy task: copiar todos los archivos de la raiz del proyecto (app)
gulp.task('copy', function() {
  gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe(size({title: 'copy'}));
});

/**
 * El Care-Package utiliza postcss para transformar el codigo CSS, la variable
 * processors almacena los plugins que se pueden usar con postcss, si desea
 * agregar mas plugins consulte la documentacion sobre su uso:
 * https://github.com/postcss/postcss
 */

// CSS task: compilar y poner prefijos automaticamente a las hojas de estilo.
gulp.task('build:css', function() {
  // Variable que contiene un arreglo con los navegadores a los que se les
  // quiere dar soporte en el proyecto.
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 7',
    'ie_mob >=7',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // Variable que contiene un arreglo con los plugins a usarse en postcss.
  var processors = [
    // Prefijos para las propiedades de CSS que lo necesiten.
    autoprefixer({browsers: AUTOPREFIXER_BROWSERS}),
    // Un plugin que contiene muchas utilidades CSS, consultar documentación:
    // http://simplaio.github.io/rucksack/docs/
    rucksack
  ];

  return gulp.src('app/styles/main.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
      'include css': true
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('.tmp/styles'))
    // Minify styles.
    .pipe(cssnano())
    .pipe(size({title: 'styles'}))
    .pipe(sourcemaps.write('./'))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist/styles'));
    //.pipe(reload({stream:true}));
});

// Scripts task: procesar codigo JS.
gulp.task('build:js', function() {
  gulp.src([
    // Nota: en listar los scripts explícitamente en el orden para que sean
    // correctamente concatenados.
    'app/scripts/vendors/jquery.js',
    'app/scripts/vendors/modernizr-custom.js',
    'app/scripts/vendors/jquery.waypoints.js',
    'app/scripts/vendors/owl-carousel.js',
    'app/scripts/context.js',
    'app/scripts/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    // Output files
    .pipe(size({title: 'scripts'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'));
});

// HTML task: compilar los templates.
gulp.task('build:html', function(){
  return gulp.src('app/**/*.html')
    .pipe(useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))
    .pipe(gulpif('*.css', uncss({
      html: [
        'app/index.html'
      ],
      // Selectores CSS para que sean ignorados por uncss
      ignore: []
    })))
    // Concatenar y minificar estilos
    // En el caso de estar usando useref build blocks
    .pipe(gulpif('*.css', cssnano()))
    // Minificar cualquier HTML
    .pipe(gulpif('*.html', htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyElements: false,
      keepClosingSlash: true
    })))
    // Output files
    .pipe(gulpif('*.html', size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
    //.pipe(reload({stream:true}));
});

// Clean task: borra todos los archivos del directorio de salida
gulp.task('clean', function() {
  del(['.tmp', 'dist/*', '!dist/.git'], {dot: true});
});

// Browser-sync task: estar atento a los cambios en los archivos refrescar el
// navegador. Crea un servidor estático en el directorio temporal.
gulp.task('start', function(){
  browserSync({
    ui: false,
    notify: false,
    logPrefix: 'WCP',
    server: ['.tmp', 'app'],
    open: false,
    port: 3000,
    ghostMode: false,
    online: false,
    reloadDelay: 1000,
    injectChanges: false,
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.styl'], ['build:css', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint', 'build:js']);
  gulp.watch(['app/images/**/*'], reload);
});

// Crea un servidor estático en el directorio de producción (dist)
gulp.task('serve:dist', function() {
  browserSync({
    notify: false,
    logPrefix: 'WCP',
    server: 'dist',
    port: 3001
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  runSequence(
    'build:css',
    ['lint', 'build:html', 'build:js', 'images', 'copy'],
    cb
  );
});
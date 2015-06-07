// File: Gulpfile.js
'use strict';
var gulp    = require('gulp'),
  connect = require('gulp-connect'),
  jshint  = require('gulp-jshint'),
  historyApiFallback = require('connect-history-api-fallback'),
  less = require('gulp-less'),
  path = require('path');
var inject  = require('gulp-inject');
var wiredep = require('wiredep').stream;

// Servidor web de desarrollo
gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8082,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback() ];
    }
  });
});
// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
// Preprocesa archivos less a CSS y recarga los cambios
gulp.task('less', function () {
  return gulp.src('./app/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./app/css'))
    .pipe(connect.reload());
});
// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
  var sources = gulp.src(['./app/js/**/*.js','./app/css/**/*.css']);
  return gulp.src('index.html', {cwd: './app'})
    .pipe(inject(sources, {read: false,ignorePath: '/app'}))
    .pipe(gulp.dest('./app'));
});
// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({directory: './app/lib'}))
    .pipe(gulp.dest('./app'));
});

// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/less/**/*.less'], ['less', 'inject']);
  gulp.watch(['./app/js/**/*.js', './Gulpfile.js'], ['jshint','inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', ['server', 'inject', 'wiredep', 'watch','less']);

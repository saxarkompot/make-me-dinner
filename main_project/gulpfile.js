// без препроцессоров

const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require('browser-sync').create();

// массив из файлов для дальнейшего преобразования оных

const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/some.css',
    './src/css/other.css'
];

// массив из файлов для дальнейшего преобразования оных

const jsFiles = [
    './src/js/lib.js',
    './src/js/some.js'
];

// styles - для работы с файлами css

function styles() {
    return gulp.src(cssFiles)
        .pipe(concat("all.css"))
        .pipe(autoprefixer({ // расстановка префиксов
            browsers: ['> 0.1%'],// для всех браузеров в мире, которые используются больше чем на одну десятую процента ставим префиксы
            cascade: false
        }))
        .pipe(cleanCSS({// минифицирует css файл наилучшим образом
            level: 2 // в данном случае наиболее строгим    
        }))
        .pipe(gulp.dest("./build/css"))
        .pipe(browserSync.stream()); // запусти синхронизацию
}

// scripts - для работы с файлами js

function scripts() {
    return gulp.src(jsFiles) // все jsFiles по адресу указанному ранее
        .pipe(concat("all.js")) // все файлы соединяются в один all.js
        .pipe(uglify({ // сжимает содержимое скомпилированого файла
            toplevel: true // максимально
        }))
        .pipe(gulp.dest("./build/js")) // папка где будут храниться скомпилированные файлы
        .pipe(browserSync.stream()); // запусти синхронизацию
}                                       

// watch - следит за изменениями в файлах, и после сохранения автоматически
// компилирует 
function watch(){
    browserSync.init({//инициализирует синхронизацию
        server: {
            baseDir: "./", // сервер указывает в какой папке искать наш HTML файл            
        },
        ui: {
            port: 3010
        },
        tunnel: false // создает временный адрес, который можно просматривать с других машин
    });

    gulp.watch('./src/css/**/*.css', styles);//следим за этим путем
    gulp.watch('./src/js/**/*.js', scripts);//следим за этим путем
    gulp.watch('./*.html', browserSync.reload);// в текущей папке при изменении HTML запусти browserSync.reload
}
// del - для удаления скомпилированых файлов в данном примере:
// удалить все что есть в папке build
function clean(){
    return del(['build/*'])
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
//gulp.task("clean", clean);
// если clean  и т.п. не зарегистрирован как task, то аргументы функции 
// пишутся без кавычек, как имя функции
// сделали таск build для подключения нескольких задач
// gulp.series команда для последовательного выполнения задач, принимает много аргументов
// gulp.parallel команда которая запускает два таска в параллельном режиме
gulp.task('build', gulp.series(clean, 
                     gulp.parallel(styles, scripts)
                     ));
// dev запускает серию, сначала build, а потом watch
gulp.task('dev', gulp.series('build','watch'));

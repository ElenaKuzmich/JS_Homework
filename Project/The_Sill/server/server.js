const express = require('express'), // удобный синтаксис и готовые функции для работы с Node.js
    bodyParser = require('body-parser'), // грамотный парсинг тела приходящих на сервер запросов
    morgan = require('morgan'), // для логир-ия информации о приходящих на сервер запросах
    config = require('config'),
    app = express();
    // nodemon - для автоматического перезапуска сервера после внесения изменений

// блок настройки сервера
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(
    require(config.get('routes.plants')),
    require(config.get('routes.plant')),
    require(config.get('routes.users')),
    require(config.get('routes.user')),
    require(config.get('routes.instances')),
    require(config.get('routes.instance'))
);

// метод слушает какой-то порт, если сервер запустился успешно, то в консоли видим текст коллбэка
app.listen(3000, () => console.log('Server has been started...'));
let express = require('express');
let sqlite = require('sqlite3').verbose();
let bodyParser = require('body-parser');

let db = new sqlite.Database(':memory:');
let app = express();

//Создание таблиц
db.run('create table operations (sender text, reciever text, money integer)');
db.run('create table users (login text primary key, password text)', (err) => {
    if (!err) {
        //Админский логин и пароль
        db.run('insert into users(login, password) values("admin", "admin")');
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Авторизация
 */
app.post('/auth', (req, res) => {
    db.all('select login, password from users', [], (err, rows) => {
        success = false;
        if (err) {
            res.status(500);
        }
        if (rows) {
            rows.forEach((row) => {
                if (row.login === req.body.login && row.password === req.body.password) {
                    success = true;
                }
            });
        }
        return res.json({ success: success });
    });
});

/**
 * Регистрация нового пользователя
 */
app.post('/reg', (req, res) => {
    let insertSript = db.prepare('insert into users(login, password) values(?, ?)');
    insertSript.bind(req.body.login, req.body.password);
    insertSript.run((err) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        return res.json({ success: true });
    });
});

/**
 * Получение всех операций
 */
app.get('/getOperations', (_req, res) => {
    var result = [];
    db.all('select sender, reciever, money from operations', [], (err, rows) => {
        if (err) {
            res.status(500);
        }
        if (rows) {
            rows.forEach((row) => {
                result.push({
                    sender: row.sender,
                    reciever: row.reciever,
                    money: row.money
                });
            });
        }
        res.json(result);
    });
});

/**
 * Добавление новой операции
 */
app.post('/addOperation', (req, res) => {
    let insertSript = db.prepare('insert into operations(sender, reciever, money) values(?, ?, ?)');
    insertSript.bind(req.body.sender, req.body.reciever, req.body.money);
    insertSript.run((err) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });

});

app.listen(process.env.PORT || 6969, () => { });

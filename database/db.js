const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database(':memory:');

function run(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err.message);
            }
            resolve(this)
        });
    });
}

function all(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows)
        });
    });
}

function get(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, rows) => {
            if (err) {
                reject(err.message);
            }
            resolve(rows)
        });
    });
}

//Создание таблиц
run('create table user(login text primary key, password text)')
    .then(() => run('insert into user(login, password) values("admin", "admin")'));

run('create table account(user_id integer, cash real)');

run('create table operation(account_id integer, cash real, comment text)');

module.exports = {
    run, all, get
}
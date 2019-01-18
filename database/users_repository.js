const db = require('./db');

module.exports.getUserIdByLoginAndPassword = (login, password) => {
    return db.get('select rowid from user where login=? and password=?', [login, password]);
}

module.exports.addUser = (login, password) => {
    return db.run('insert into user(login, password) values(?, ?)', [login, password]);
}

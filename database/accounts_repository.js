const db = require('./db');

module.exports.getAccountsByUserId = (userId) => {
    return db.all('select rowid, name, cash from account where user_id=?', [userId]);
}

module.exports.addAccount = (userId, name, cash) => {
    return db.run('insert into account(user_id, name, cash) values(?, ?, ?)', [userId, name, cash]);
}
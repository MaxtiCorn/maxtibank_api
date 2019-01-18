const db = require('./db');

module.exports.getAccountsByUserId = (userId) => {
    return db.all('select rowid, cash from account where user_id=?', [userId]);
}

module.exports.addAccount = (userId, cash) => {
    return db.run('insert into account(user_id, cash) values(?, ?)', [userId, cash]);
}
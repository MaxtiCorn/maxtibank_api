const db = require('./db');

module.exports.getOperationsByUserId = (userId) => {
    return db.all('select operation.cash from operation join account on operation.account_id=account.rowid where account.user_id=?', [userId]);
}

module.exports.getOperationsByAccountId = (accountId) => {
    return db.all('select operation.cash from operation join account on operation.account_id=account.rowid where account.rowid=?', [accountId]);
}

module.exports.addOperation = (accountId, cash) => {
    return db.run('insert into operation(account_id, cash) values(?, ?)', [accountId, cash]);
}
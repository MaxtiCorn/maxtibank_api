const express = require('express');
const bodyParser = require('body-parser');
const usersRepository = require('./database/users_repository');
const operationsRepository = require('./database/operations_repository');
const accountsRepository = require('./database/accounts_repository');

const app = express();

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
    const login = req.body.login;
    const password = req.body.password;
    (login && password ? usersRepository.getUserIdByLoginAndPassword(login, password) : Promise.reject())
        .then(result => res.json({ id: result.rowid }))
        .catch(err_message => res.status(400).json(err_message));
});

/**
 * Регистрация нового пользователя
 */
app.post('/reg', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    (login && password ? usersRepository.addUser(login, password) : Promise.reject())
        .then(success => res.json({ id: success.lastID }))
        .catch(err_message => res.status(400).json(err_message));
});

/**
 * Добавление нового счета пользователя
 */
app.post('/addAccount', (req, res) => {
    const userId = req.body.userId;
    const name = req.body.name;
    const cash = req.body.cash;
    (userId && name && cash ? accountsRepository.addAccount(userId, name, cash) : Promise.reject())
        .then(success => res.json({ id: success.lastID }))
        .catch(err_message => res.status(400).json(err_message));
});

/**
 * Получение счетов пользователя
 */
app.get('/getAccounts', (req, res) => {
    const userId = req.query['userId'];
    (userId ? accountsRepository.getAccountsByUserId(userId) : Promise.reject())
        .then(accounts => res.json(accounts.map((account) => { return { id: account.rowid, name: account.name, cash: account.cash } })))
        .catch(err_message => res.status(400).json(err_message));
});

/**
 * Получение операций пользователя
 */
app.get('/getOperations', (req, res) => {
    const userId = req.query['userId'];
    const accountId = req.query['accountId'];
    (userId ? operationsRepository.getOperationsByUserId(userId) :
        accountId ? operationsRepository.getOperationsByAccountId(accountId) : Promise.reject())
        .then(result => res.json(result))
        .catch(err_message => res.status(400).json(err_message));
});

/**
 * Добавление новой операции
 */
app.post('/addOperation', (req, res) => {
    const accountId = req.body.accountId;
    const cash = req.body.cash;
    const comment = req.body.comment ? req.body.comment : '';
    (accountId && cash ? operationsRepository.addOperation(accountId, cash, comment) : Promise.reject())
        .then(_success => res.json({ success: true }))
        .catch(err_message => res.status(400).json(err_message));
});

app.listen(process.env.PORT || 6969, () => { });

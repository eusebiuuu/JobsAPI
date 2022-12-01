const express = require('express');
const { httpAddNewUser, httpGetUserInfo } = require('../controllers/users.controller');

const userAuthRouter = express.Router();

userAuthRouter.post('/login', httpGetUserInfo);
userAuthRouter.post('/register', httpAddNewUser);

module.exports = userAuthRouter;
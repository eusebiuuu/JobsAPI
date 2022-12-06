const express = require('express');
const { httpAddNewUser, httpLoginUser, httpUpdateUser } = require('../controllers/users.controller');
const { authorizeUser } = require('../middleware/auth');

const userAuthRouter = express.Router();

userAuthRouter.post('/login', httpLoginUser);
userAuthRouter.post('/register', httpAddNewUser);
userAuthRouter.patch('/update', authorizeUser, httpUpdateUser);

module.exports = userAuthRouter;
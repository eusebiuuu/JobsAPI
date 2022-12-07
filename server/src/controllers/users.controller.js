const { addNewUser, isUnique, getUserInfo, editUser } = require("../models/users.model");
const { StatusCodes } = require('http-status-codes');

async function httpAddNewUser(req, res) {
    const { username, password, email } = req.body;
    const tempUser = { username, password, email };
    await isUnique(tempUser);
    const user = await addNewUser(tempUser);
    return res.status(StatusCodes.CREATED).json({ username: user.username, token: user.token });
}

async function httpLoginUser(req, res) {
    const { username, password } = req.body;
    const {token, user} = await getUserInfo({ username, password });
    console.log(user);
    return res.status(StatusCodes.OK).json({ username: user.username, token });
}

async function httpUpdateUser(req, res) {
    const newUser = { _id: req.userID, ...req.body };
    const result = await editUser(newUser);
    return res.status(StatusCodes.OK).json(result);
}

module.exports = {
    httpAddNewUser,
    httpLoginUser,
    httpUpdateUser,
}
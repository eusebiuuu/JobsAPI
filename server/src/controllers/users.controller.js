const { addNewUser, isUnique, getUserInfo } = require("../models/users.model");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require('http-status-codes');

async function httpAddNewUser(req, res) {
    const { username, password, email } = req.body;
    const tempUser = { username, password, email };
    await isUnique(tempUser);
    const user = await addNewUser(tempUser);
    return res.status(StatusCodes.CREATED).json({ username: user.username, token: user.token });
}

async function httpGetUserInfo(req, res) {
    const { username, password } = req.body;
    const token = await getUserInfo({ username, password });
    return res.status(StatusCodes.OK).json({ username, token });
}

module.exports = {
    httpAddNewUser,
    httpGetUserInfo,
}
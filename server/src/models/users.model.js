const { BadRequestError, UnauthenticatedError } = require('../errors');
const Users = require('./users.mongo');

function isValidUser(user) {
    const curUser = new Users(user);
    const userErrors = curUser.validateSync();
    if (!userErrors) {
        return null;
    }
    // console.log(userErrors);
    let errorMessage;
    Object.values(userErrors.errors).map((err) => {
        errorMessage = err.message;
    });
    throw new BadRequestError(errorMessage);
}

async function addNewUser(user) {
    isValidUser(user);
    const completeUser = await Users.create(user);
    const token = completeUser.createJWT();
    return { ...completeUser._doc, token };
}

async function isUnique(user) {
    const result = await Users.findOne({
        $or: [{ email: user.email }, { username: user.username }],
    });
    if (result) {
        throw new BadRequestError('You already have an account');
    }
}

async function getUser(username) {
    return await Users.findOne({
        username: username,
    });
}

async function getUserInfo(user) {
    const foundUser = await getUser(user.username);
    // console.log(foundUser);
    if (!foundUser || !user.password) {
        throw new UnauthenticatedError(`Invalid credentials`);
    }
    const passwordMatch = await foundUser.checkPasswordValidity(user.password);
    if (!passwordMatch) {
        throw new UnauthenticatedError(`Invalid credentials`);
    }
    const token = foundUser.createJWT();
    return token;
}

module.exports = {
    addNewUser,
    getUser,
    getUserInfo,
    isUnique,
}
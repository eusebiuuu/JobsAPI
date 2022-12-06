const { BadRequestError, UnauthenticatedError } = require('../errors');
const Users = require('./users.mongo');
const bcrypt = require('bcryptjs');

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
        throw new BadRequestError('A user with this email or username already exists');
    }
}

async function getUser(user) {
    const result = await Users.findOne({
        $or: [{ _id: user._id }, { username: user.username }],
    });
    if (!result) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    return result;
}

async function getUserInfo(user) {
    const foundUser = await getUser({ username: user.username });
    if (!user.password) {
        throw new UnauthenticatedError(`Invalid credentials`);
    }
    const passwordMatch = await foundUser.checkPasswordValidity(user.password);
    if (!passwordMatch) {
        console.log(user.password);
        throw new UnauthenticatedError(`Invalid credentials`);
    }
    const token = foundUser.createJWT();
    return {
        user: foundUser,
        token
    };
}

async function editUser(newUser) {
    if (newUser.password) {
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
    }
    const oldUser = await getUser({ _id: newUser._id });
    const finalUser = { ...oldUser._doc, ...newUser };
    isValidUser(finalUser);
    await Users.findOneAndUpdate({
        _id: finalUser._id,
    }, finalUser);
    return finalUser;
}

module.exports = {
    addNewUser,
    getUser,
    getUserInfo,
    isUnique,
    editUser,
}
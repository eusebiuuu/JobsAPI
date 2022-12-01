const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

async function authorizeUser(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Token not provided correctly');
    }
    const token = authToken.split(' ')[1];
    // console.log(token);
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        const { username, userID } = decodedToken;
        req.userInfo = { username, userID };
        next();
    } catch (err) {
        throw new UnauthenticatedError('Invalid token');
    }
}

module.exports = {
    authorizeUser,
};
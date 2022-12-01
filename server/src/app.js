require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { authorizeUser } = require('./middleware/auth');
const app = express();
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const xss = require('xss-clean');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const userAuthRouter = require('./routes/users.router');
const jobsRouter = require('./routes/jobs.router');

app.use(helmet());
app.use(xss());
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 60 * 1000,
    max: 100,
}));
app.use(express.json());
app.use('/api/users', userAuthRouter);
app.use('/api/jobs', authorizeUser, jobsRouter);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

module.exports = app;
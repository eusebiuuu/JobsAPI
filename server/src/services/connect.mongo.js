const mongoose = require('mongoose');
const { BadRequestError, CustomAPIError } = require('../errors');

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB!');
});

mongoose.connection.on('error', (error) => {
    throw new CustomAPIError(error);
});

async function connectToMongoDB() {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
}

async function disconnectToMongoDB() {
    await mongoose.disconnect();
}

module.exports = {
    connectToMongoDB,
    disconnectToMongoDB,
}
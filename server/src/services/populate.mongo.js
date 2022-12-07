const jobsData = require('./jobs.json');
const Jobs = require('../models/jobs.mongo');

async function populateDB() {
    await Jobs.create(jobsData);
    console.log('Database populated!');
}

module.exports = {
    populateDB,
}

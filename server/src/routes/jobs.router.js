const express = require('express');
const { httpGetAllJobs, httpGetOneJob, httpGetStats, httpAddNewJob, httpEditJob, httpDeleteJob } = require('../controllers/jobs.controller');

const jobsRouter = express.Router();

jobsRouter.get('/stats', httpGetStats);
jobsRouter.get('/', httpGetAllJobs);
jobsRouter.get('/:id', httpGetOneJob);
jobsRouter.post('/', httpAddNewJob);
jobsRouter.patch('/:id', httpEditJob);
jobsRouter.delete('/:id', httpDeleteJob);

module.exports = jobsRouter;

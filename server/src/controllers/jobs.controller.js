const { StatusCodes } = require("http-status-codes");
const { addNewJob, getAllJobs, getOneJob, editJob, deleteJob } = require("../models/jobs.model");

async function httpAddNewJob(req, res) {
    const { userID } = req.userInfo;
    const { position, company } = req.body;
    const result = await addNewJob(userID, { position, company });
    return res.status(StatusCodes.CREATED).json(result);
}

async function httpGetAllJobs(req, res) {
    const { userID } = req.userInfo;
    const result = await getAllJobs(userID);
    return res.status(StatusCodes.OK).json(result);
}

async function httpGetOneJob(req, res) {
    const jobID = req.params.id;
    const { userID } = req.userInfo;
    const result = await getOneJob(jobID, userID);
    return res.status(StatusCodes.OK).json(result);
}

async function httpEditJob(req, res) {
    const jobID = req.params.id;
    const { userID } = req.userInfo;
    const { position, company, status } = req.body;
    const result = await editJob({ createdBy: userID, _id: jobID, position, company, status });
    return res.status(StatusCodes.OK).json(result);
}

async function httpDeleteJob(req, res) {
    const jobID = req.params.id;
    const { userID } = req.userInfo;
    await deleteJob(jobID, userID);
    return res.status(StatusCodes.OK).json({ message: 'Successfully deleted' });
}

module.exports = {
    httpAddNewJob,
    httpDeleteJob,
    httpEditJob,
    httpGetAllJobs,
    httpGetOneJob,
}
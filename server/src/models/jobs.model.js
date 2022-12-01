const { BadRequestError, NotFoundError } = require("../errors");
const Jobs = require("./jobs.mongo");

function isValidJob(job) {
    const curJob = new Jobs(job);
    const jobErrors = curJob.validateSync();
    if (!jobErrors) {
        return null;
    }
    // console.log(jobErrors);
    let errorMessage;
    Object.values(jobErrors.errors).map((err) => {
        errorMessage = err.message;
    });
    throw new BadRequestError(errorMessage);
}

async function getAllJobs(userID) {
    return await Jobs.find({
        createdBy: userID,
    })
    .select({
        __v: 0,
    });
}

async function getOneJob(jobID, userID) {
    const result = await Jobs.findOne({
        _id: jobID,
        createdBy: userID,
    });
    if (!result) {
        throw new NotFoundError('Job does not exist');
    }
    return result;
}

async function addNewJob(userID, newJob) {
    const job = { ...newJob, createdBy: userID };
    isValidJob(job);
    return await Jobs.create(job);
}

async function editJob(editedJob) {
    const initialJob = await getOneJob(editedJob._id, editedJob.createdBy);
    const finalJob = { ...initialJob._doc, ...editedJob };
    isValidJob(finalJob);
    await Jobs.replaceOne({
        _id: editedJob._id,
    }, finalJob);
    return finalJob;
}

async function deleteJob(jobID, userID) {
    const result = await Jobs.deleteOne({
        _id: jobID,
        createdBy: userID,
    });
    if (result.deletedCount !== 1) {
        throw new NotFoundError('Job does not exist');
    }
}

module.exports = {
    getAllJobs,
    getOneJob,
    addNewJob,
    deleteJob,
    editJob,
};
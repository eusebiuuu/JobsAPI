const mongoose = require('mongoose');
const moment = require('moment');
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

async function getStats(userID) {
    const result = await Jobs.aggregate([
        {
            $match: {
                createdBy: mongoose.Types.ObjectId(userID),
            },
        },
        {
            $group: {
                _id: '$status',
                count: {
                    $sum: 1,
                }
            }
        }
    ]);
    const stats = result.reduce((statusObj, currStatus) => {
        const { _id: jobStatus, count } = currStatus;
        statusObj[jobStatus] += count;
        return statusObj;
    }, {
        pending: 0,
        interview: 0,
        declined: 0,
    });

    const monthlyApp = await Jobs.aggregate([
        {
            $match: {
                createdBy: mongoose.Types.ObjectId(userID),
            },
        },
        {
            $group: {
                _id: {
                    year: {
                        $year: '$createdAt',
                    },
                    month: {
                        $month: '$createdAt',
                    }
                },
                count: {
                    $sum: 1,
                }
            }
        },
        {
            $sort: {
                '_id.year': -1,
                '_id.month': 1,
            }
        },
        {
            $limit: 5,
        }
    ]);
    const monthlyApplications = monthlyApp.map(app => {
        const { _id: { year, month }, count } = app;
        const date = moment().month(month - 1).year(year).format('MMM Do YY');
        return { date, count };
    }).reverse();
    return { stats, monthlyApplications };
}

module.exports = {
    getAllJobs,
    getOneJob,
    addNewJob,
    deleteJob,
    editJob,
    getStats,
};
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    position: {
        type: String,
        required: [true, 'Please provide a position'],
    },
    company: {
        type: String,
        required: [true, 'Please provide the company name'],
    },
    date: {
        type: Date,
        default: Date.now().toString(),
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'interview', 'declined'],
            message: '{VALUE} is not supported',
        },
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, `Please provide the user ID`],
    },
}, {
    timestamps: true,
});

const Jobs = mongoose.model('Job', jobSchema);

module.exports = Jobs;
const mongoose = require ('mongoose');

const taskSchema = mongoose.Schema(
    {
        _id: {
            type: String,
        },
        name: {
            type: String,
        },
        startDate: {
            type: String,
        },
        endDate: {
            type: String,
        },
        assignedTo: {
            type: Array,
        },
        description: {
            type: String,
        },
        id_list: {
            type: String,
        },
    },
    {
        versionKey: false
    }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task
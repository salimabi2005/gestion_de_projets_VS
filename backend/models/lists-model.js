const mongoose = require ('mongoose');

const listSchema = mongoose.Schema(
    {
        _id: {
            type: String,
        },
        name: {
            type: String,
        },
        idProject: {
            type: String,
        },
    },
    {
        versionKey: false
    }
);

const List = mongoose.model("list", listSchema);

module.exports = List
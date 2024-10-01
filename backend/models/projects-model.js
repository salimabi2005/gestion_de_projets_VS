const mongoose = require ('mongoose');

const projectSchema = mongoose.Schema(
    {
        _id: {
            type: String,
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
      
    },
    {
        versionKey: false
    }
);

const Project = mongoose.model("project", projectSchema);

module.exports = Project
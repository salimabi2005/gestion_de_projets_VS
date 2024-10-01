const mongoose = require ('mongoose');

const userSchema = mongoose.Schema(
    {
        _id: {
            type: String,
        },
        nom: {
            type: String,
        },
        prenom: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
        },
        statut: {
            type: String,
        }
    },
    {
        versionKey: false
    }
);

const User = mongoose.model("user", userSchema);

module.exports = User
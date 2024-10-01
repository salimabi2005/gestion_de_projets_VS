const mongoose = require ('mongoose');

const pieceSchema = mongoose.Schema(
    {
        _id: {
            type: String,
        },
        name: {
            type: String,
        },
        date: {
            type: String,
        },
        url: {
            type: String,
        },
        id_task: {
            type: String,
        }
    },
    {
        versionKey: false
    }
);

const Piece = mongoose.model("piece", pieceSchema);

module.exports = Piece
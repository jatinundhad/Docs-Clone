const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    documentTitle:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: Object,
        default: ""
    },
    ownerUserId: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
});
module.exports = mongoose.model("Document", documentSchema);
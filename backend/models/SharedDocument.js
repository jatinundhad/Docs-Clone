const mongoose = require("mongoose");

const sharedDocumentSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    ownerUserId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    sharedUserEmail: {
        type: String,
        required: true
    },
    documentTitle: {
        type: String
    }
})
module.exports = mongoose.model("SharedDocument", sharedDocumentSchema);
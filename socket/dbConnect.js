const mongoose = require("mongoose");
const connectToMongo = async () => {
    await mongoose.connect(process.env.DATABASE_CONNECTION);
    console.log("Connected to MongoDB");
};
const mongoObjectId = mongoose.Types.ObjectId;
module.exports = {
    connectToMongo,
    mongoObjectId
}
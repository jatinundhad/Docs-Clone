const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const path = require("path");
const { SALT_ROUND } = require(path.join(__dirname, "..", "constants"));

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    color:{
        type: String
    }
});
userSchema.pre("save", function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = bcrypt.hashSync(this.password, SALT_ROUND);
    next();
})
module.exports = mongoose.model('User', userSchema);
const jwt = require("jsonwebtoken");

const get_jwt_token =  (data, expirationTime)=>{
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: expirationTime
    });
}

const verify_jwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

const verify_user_with_token = (token, id, email) => {
    try{
        const obj =  jwt.verify(token, process.env.JWT_SECRET);
        return obj.email == email && obj.userId == id;
    }
    catch(err) {
        return false;
    }
}

module.exports = {
    get_jwt_token,
    verify_jwt,
    verify_user_with_token
}
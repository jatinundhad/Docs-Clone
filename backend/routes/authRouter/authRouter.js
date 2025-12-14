const express = require("express");
const path = require("path");
const userSchema = require("../../models/User");
const bcrypt = require("bcryptjs");
const { SUCCESSFUL_LOGIN, ALL_COLORS, USER_SUCCESSFULY_REGISTERED, GENERIC_MESSAGE, INTERNAL_ERROR_MESSAGE, EMAIL_EMPTY_ERROR_MESSAGE, PASSWORD_EMPTY_ERROR_MESSAGE, EMAIL_NOT_FOUND, INVALID_CREDENTIALS, USER_ALREADY_EXISTS, FIRST_NAME_EMPTY_ERROR_MESSAGE, LAST_NAME_EMPTY_ERROR_MESSAGE, JWT_TOKEN_VALIDITY } = require(path.join(__dirname, "..","..", "constants"));
const { get_jwt_token, verify_jwt } = require(path.join(__dirname, "jwt"));

// Using router
const authRouter = express.Router();

const getColor = () => {
    const randomIndex = Math.floor(Math.random() * ALL_COLORS.length);
    return ALL_COLORS[randomIndex];
}

authRouter.post("/register", async(req, res) => {
    try{
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        if(!email){
            return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
        }
        if(!password){
            return res.json(GENERIC_MESSAGE(false, PASSWORD_EMPTY_ERROR_MESSAGE));
        }
        if(!firstName){
            return res.json(GENERIC_MESSAGE(false, FIRST_NAME_EMPTY_ERROR_MESSAGE));
        }
        if(!lastName){
            return res.json(GENERIC_MESSAGE(false, LAST_NAME_EMPTY_ERROR_MESSAGE));
        }
        if(await userSchema.findOne({ email })){
            return res.json(GENERIC_MESSAGE(false, USER_ALREADY_EXISTS))
        }
        const user = await userSchema.create({
            firstName, email, lastName, password,
            color: getColor()
        });
        const userObject = {
            email, firstName, lastName, userId: user._id,
            color: user.color
        }
        return res.json(GENERIC_MESSAGE(true, USER_SUCCESSFULY_REGISTERED, {
            user: userObject,
            token: get_jwt_token(userObject, JWT_TOKEN_VALIDITY)
        }))
    }
    catch(err){
        console.log(err)
        return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
    }
})

authRouter.post("/login", async(req, res)=>{
    // Request object consists of email, password
    try{
        const email = req.body.email;
        const password = req.body.password;

        if(!email){
            return res.json(GENERIC_MESSAGE(false, EMAIL_EMPTY_ERROR_MESSAGE));
        }
        if(!password){
            return res.json({
                status: false,
                message: PASSWORD_EMPTY_ERROR_MESSAGE
            });
        }
        // Check for credentials
        const entry = await userSchema.findOne({
            email
        });

        if(!entry){
            return res.json(GENERIC_MESSAGE(false, EMAIL_NOT_FOUND))
        }
        const isPasswordValid = bcrypt.compareSync(password, entry.password);

        if (!isPasswordValid) {
            return res.json(GENERIC_MESSAGE(false, INVALID_CREDENTIALS));
        }
        const userObject = {
            email: entry.email,
            firstName: entry.firstName,
            lastName: entry.lastName,
            userId: entry._id,
            color: entry.color
        }
        return res.json(GENERIC_MESSAGE(true, SUCCESSFUL_LOGIN, {token: get_jwt_token(userObject, JWT_TOKEN_VALIDITY), user: userObject}))
    }
    catch(err){
        console.log(err);
        return res.json(GENERIC_MESSAGE(false, INTERNAL_ERROR_MESSAGE));
    }
});

authRouter.post("/verify", (req, res)=>{
    try{
        const token = req.body.token;
        return res.json(GENERIC_MESSAGE(true, "", {user: verify_jwt(token)}));
    }
    catch(err){
        return res.json(GENERIC_MESSAGE(false, ""));
    }
})

module.exports = authRouter;
const jwt = require("jsonwebtoken");
const SECRET_KEY = 'devTinderSecretKey';
const User  = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            throw new Error("Authentication token is not valid");
        }

        const decodedobj = jwt.verify(token, SECRET_KEY);
        const { _id } = decodedobj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send('Error: ' + err.message);
    }

}


module.exports = { userAuth };
const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = (req,res,next)=>{
    try {
        //Fetch token from headers
        var token = req.headers.token;
        if (!token) {
            return res.status(400).json({
                "status": 400,
                "error": "Auth token must be passed in the headers."
            })
        }
        // if token found, verify the token
        var data = jwt.verify(token, JWT_SECRET_KEY);
        // token verified successfully
        req.user = data;
        next();
    } catch (e) {
        return res.status(401).json({
            "status": 401,
            "error": "Unauthorized access.(Invalid token)"
        })
    }
}


module.exports = verifyToken;
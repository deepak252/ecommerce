const express = require("express");
const User = require("../models/User");
const {body,validationResult} =require("express-validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateLoginRequest = require("../middlewares/validate_login_request");

const router= express.Router();
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Register (POST), token not required
router.post("/register",[
    body("email","Invalid email").isEmail(),
    body("name","Name should contain at least 3 characters").isLength({ min: 3 }),
    body("password","Password should contain at least 4 characters").isLength({ min: 4 }),
],async (req,res)=>{
    // console.log(req.body);
    // res.send(req.body);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            "errors":errors.array()
        });
    }

    try{
        // Check if email already exist then return error
        var user = await User.findOne({email : req.body.email});
        if(user !==null){ //email already exist
            return res.status(409).json({  //409 : Conflict
                "status": 409, 
                "error": "User already exist with this email."
            });
        }
        //else Create account
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await  bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        });
        //account created

        //create JWT auth token
        const payload = {
            "id": user.id,
            "name": user.name,
            "email": user.email
        };
        const token = jwt.sign(payload, JWT_SECRET_KEY );
        //token created
        //user registered successfully
        return res.json({
            "status": 200,
            "message": "Account created successfully.",
            "token" : token,
            // "data": {user}
        });
    }catch(e){
        console.error("register error : ", e);
        return res.status(500).json({
            "status" : 500,
            "error" : "Internal server error."
        })
    }
})

// LOGIN (POST), token not required
router.post("/login",[
    body("email","Invalid email").isEmail(),
    body("password","Password can't be empty").exists()
],validateLoginRequest,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            "errors": errors.array()
        });
    }

    try{
        // Check if email exists, if not then return error
        let user = await User.findOne({email : req.body.email});
        if(!user){
            return res.status(404).json({  //409 : Conflict
                "status": 404,
                "error": "Invalid email/password."
            });
        }
        //email exists
        //Now check password correct of not
        var passwordMatched = await bcrypt.compare(req.body.password, user.password);
        // if password not matched, return error
        if(!passwordMatched){
            return res.status(404).json({  //409 : Conflict
                "status": 404,
                "error": "Invalid email/password."
            });
        }
        //both email and password are correct

        //Now, create JWT auth token
        const payload = {
            "id": user.id,
            "name": user.name,
            "email": user.email
        };
        let token = jwt.sign(payload, JWT_SECRET_KEY);

        return res.status(200).json({  //409 : Conflict
            "status": 200,
            "message": "Login successful.",
            "token": token
            // "message": "This email is already exist. Please enter different email."
        });

    }catch(e){
        console.error("login error : ", e);
        return res.status(500).json({
            "status": 500,
            "error": "Internal server error."
        })
    }
});

// //GET user profile : (GET), token required in the headers
// router.get("/user", validateUserToken,async(req,res)=>{
//     try{
//         //request validation successful
//         //find user by id from database
//         const user = await User.findById(req.user.id).select("-id");

//         if(user){
//             return res.json({
//                 "status": 200,
//                 user
//             })
//         }
//         return res.status(404).json({
//             "status": 404,
//             "error": "User not found",
//         })
//     }catch(e){
//         console.log("get user error : ",e);
//         return res.status(500).json({
//             "status": 500,
//             "error": "Internal server error"
//         })
//     }
// })

// //get all users profile : (GET), token required in the headers
// router.get("/users/all", validateUserToken, async (req, res) => {
//     try {
//         //request validation successful
//         const users = await User.find().select("-id");

//         if (users) {
//             return res.json({
//                 "status": 200,
//                 users
//             })
//         }
//         return res.status(404).json({
//             "status": 404,
//             "error": "User not found",
//         })

//     } catch (e) {
//         console.log("get user error : ", e);
//         return res.status(500).json({
//             "status": 500,
//             "error": "Internal server error"
//         })
//     }
// })

// //get all users profile : (GET), token required in the headers
// router.get("/users/all", validateUserToken, async (req, res) => {
//     try {
//         //request validation successful
//         const users = await User.find().select("-id");

//         if (users) {
//             return res.json({
//                 "status": 200,
//                 users
//             })
//         }
//         return res.status(404).json({
//             "status": 404,
//             "error": "User not found",
//         })

//     } catch (e) {
//         console.log("get user error : ", e);
//         return res.status(500).json({
//             "status": 500,
//             "error": "Internal server error"
//         })
//     }
// })

module.exports = router;
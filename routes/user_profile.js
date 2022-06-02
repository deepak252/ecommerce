const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verify_token.js");
const User = require("../models/User.js");
router.get("/getProfile", verifyToken,async  (req, res) => {
    try {
        //request validation successful
        //find user by id from database
        const user = await User.findById(req.user.id).select("-password");
        if(user){
            return res.json({
                "status": 200,
                "data" : {
                    ...user._doc
                }
            })
        }
        return res.status(404).json({
            "status": 404,
            "error": "User not found",
        })
    }catch(e){
        console.log("getProfile error : ",e);
        return res.status(500).json({
            "status": 500,
            "error": "Internal server error"
        })
    }
});

//update name,email,
router.post("/updateProfile", verifyToken, async (req, res) => {
    try {
        //request validation successful
        const { name, email } = req.body;
        //find user by id then update from database 
        User.findByIdAndUpdate(
            req.user.id,
            {name,email},
            (err,user,result)=>{
                if(err){
                    return res.status(500).json({
                        "status": 500,
                        "error": "Error while updating profile",
                        "message": err.message
                    });
                }
                //if user exist
                if(user){
                    return res.json({
                        "status": 200,
                        "message": "Profile updated successfully.",
                    })
                }else{
                    return res.status(404).json({
                        "status": 404,
                        "error": "User not found",
                    });
                }
            }
        )
    }catch (e) {
        console.log("updateProfile error : ", e);
        return res.status(500).json({
            "status": 500,
            "error": "Internal server error"
        })
    }
});

module.exports = router;
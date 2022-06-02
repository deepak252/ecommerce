const express = require("express");
const router = express.Router();
const validateUserToken = require("../middlewares/verify_token.js");
const ObjectId = require('mongoose').Types.ObjectId; 
const User = require("../models/User");
//Only for testing

//getUserById
router.get("/getUserById/:id",async (req,res)=>{
    try{
        const id = req.params.id;
        if(!id){
            //id not exists in parameter
            return  res.status(400).json({
                "status": 400,
                "error": "id must be passed as parameter in url"
            });
        }
        // id is not a valid mongodb 'id'
        if(!ObjectId.isValid(id)){
            return res.status(400).json({
                "status": 400,
                "error": "Invalid id"
            });
        }
        //find user by id
        User.findById(id)
        .then((user,err)=>{
            if(err){
                return res.status(404).json({
                    "status": 404,
                    "error": "User not found",
                    "message" : err.message
                });
            }
            if(user){
                delete user._doc.password;
                return res.json({
                    "status": 200,
                    "data": {
                        ...user._doc
                    }
                });
            }
            return res.status(404).json({
                "status": 404,
                "error": "User not found"
            });
        });
        
    }catch(e){
        console.log("getUserById error : ", e);
        return res.status(500).json({
            "status": 500,
            "error": "Internal server error"
        })
    }
});

//get all users
router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.json({
            "status": 200,
            "data": users
        })

    } catch (e) {
        console.log("getUserById error : ", e);
        return res.status(500).json({
            "status": 500,
            "error": "Internal server error"
        })
    }

});

module.exports = router;
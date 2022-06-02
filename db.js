const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.MONGODB_URL + "/ecommerceDB";

const connectToMongo = ()=>{
    mongoose.connect(url,(err)=>{
        if(err){
            console.log("Error connecting to database");
            console.log(err);
        }else{
            console.log("Successfully connected to database");
        }
    })
}

module.exports = connectToMongo;

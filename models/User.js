const {Schema,model} = require("mongoose");

const userSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        unique: true,
        type: String,
    },
    password:{
        required: true,
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
   
})
const User = model('user', userSchema);
module.exports = User;
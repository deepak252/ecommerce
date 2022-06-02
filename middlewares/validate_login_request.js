
/** Creates a new document or documents */
const validateLoginRequest=(req,res,next)=>{
    const {email,password} = req.body;
    //if both email and password not present in headers
    if (!email && !password){
        return res.status(400).json({
            "status" : 400,
            "error" : "Headers must contain email and password."
        })
    }
    // if email not present in headers
    if (!email ) {
        return res.status(400).json({
            "status": 400,
            "error": "Headers must contain email."
        })
    }
    // if password not present in headers
    if (!password ) {
        return res.status(400).json({
            "status": 400,
            "error": "Headers must contain password."
        })
    }

    next();
    
}

module.exports = validateLoginRequest;
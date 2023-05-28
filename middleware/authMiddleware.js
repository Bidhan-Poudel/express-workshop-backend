const registerSchema = require('../models/registerSchema');
const userSchema= require('../models/userSchema');
const {verifyToken}= require('../utils/token');

const authMiddleware= async(req,res,next)=>{

    //extract token from authorization
    const requestToken= req.headers.authorization
    if(!requestToken){
        return res.status(401).json({
            message:"You are not authorized"
        })
    }
    // console.log(requestToken);

    //getting only token part
    const parsedToken = requestToken.replace("Bearer ","")

    // console.log(parsedToken);

    //check the validity of 
    const verifiedData= verifyToken(parsedToken)

    // console.log(verifiedData);

    if(!verifiedData){
        return res.status(401).json({
            message:"Not valid token."
        })
    }

    const registeredUser= await registerSchema.exists({
        email:verifiedData.email
    })
    
    // console.log(user);

    if(!registeredUser){
        return res.status(401).json({
            message:"Not authorized"
        })
    }

    req.registeredUser={
        email:verifiedData.email,
        address:verifiedData.address,
        _id:verifiedData._id
    }

    next()

}

module.exports= authMiddleware;

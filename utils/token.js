const jwt= require('jsonwebtoken');
// require('dotenv').config();

const tokenSecret=  process.env.JWT_SECRET||"tokenSecret"
const expiresIn= process.env.JWT_EXPIRE|| "2h"

const generateToken = (data)=>(
    jwt.sign(data,tokenSecret,{expiresIn})
)

const verifyToken = (token)=>{
    try{
        return jwt.verify(token,tokenSecret)
    }
    catch(e){
        return null
    }
}



exports.generateToken= generateToken
exports.verifyToken=verifyToken
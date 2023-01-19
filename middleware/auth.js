const JWT = require('jsonwebtoken');
const User = require('../models/userModel.js');
const asyncHandler =  require('express-async-handler');

const protect = asyncHandler(async (req,res,next)=> {

    try{
        const token = req.headers.authorization.split(' ')[1]
        console.log(token, "token")
        if(!token){
            res.status(401)
            throw new Error("No Token. Not Authorized!")

        }

        // verify token
        
        const verified = JWT.verify(token, process.env.JWTSECRET)
        // get user id from token
            
        const user = await User.findById(verified.id).select("-password")
    
        if(!user){
            res.status(401)
            throw new Error("User Not Found")
        }
        req.user = user
        next()
    }catch(err){
        res.status(401)
        console.log(err.message)
        throw new Error("Not authorized. Please Log In")
    }
})


// Authorize Staff Roles
const authorizeRoles = (roles) => {
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new Error(`${req.user.role}s are not authorized to visit this page`)
        }
        next()
    }
}

module.exports =  {protect, authorizeRoles}
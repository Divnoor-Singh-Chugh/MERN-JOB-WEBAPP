const {catchAsyncError}=require('./catchAsyncError');
const { errorHandler } = require('./error');
const User=require('../models/User')
const jwt=require('jsonwebtoken');

const isAuthorized=catchAsyncError( async (req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
    {
        return next(new errorHandler("User not authenticated",400))
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
 
    req.user=await User.findById(decoded.id);
    next()
})

module.exports={isAuthorized};
class errorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

const errorMiddleware=(error,req,res,next)=>{
error.message=error.message||"Internal server error";
error.statusCode=error.statusCode||500;
if(error.name === "CaseError") 
{
const message=`Resource not found. Invalid ${error.path}`
error=new errorHandler(message,400);
}

if(error.code ===11000) 
{
const message=`Duplicate ${Object.keys(error.keyValue)} Entered`
error=new errorHandler(message,400);
}

if(error.name === "JsonWebTokenError") 
{
const message=`Json web Token is invalid. Try Again`
error=new errorHandler(message,400);
}
if(error.name === "TokenExpiredError") 
{
const message=`Json Web Token is expired. Try Again`
error=new errorHandler(message,400);
}

return res.status(error.statusCode).json({
    success:false,
    message:error.message
})
}

module.exports={errorHandler,errorMiddleware};
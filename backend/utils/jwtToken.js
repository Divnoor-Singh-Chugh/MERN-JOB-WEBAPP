require('dotenv').config();

const sendToken=(user,statusCode,res,message)=>{
    const token=user.getJWTToken();
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        secure: true,
        SameSite:'None'
    }
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Expires=${options.expires.toUTCString()}`);
    res.status(statusCode).cookie("token",token,options).json({
        success:true,user,message,token
    })
}

module.exports={sendToken}
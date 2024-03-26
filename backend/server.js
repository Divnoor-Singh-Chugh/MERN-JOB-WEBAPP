const app=require('./app');
require('dotenv').config();
const cloudinary=require('cloudinary');
const port=process.env.PORT;

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET
})


app.listen(port,()=>{
    console.log(`Server is up and running on port ${port}`);
})



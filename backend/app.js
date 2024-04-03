const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRouter=require('./routes/userRouter');
const jobRouter=require('./routes/jobRouter');
const applicationRouter=require('./routes/applicationRouter');
const { errorMiddleware } = require('./middlewares/error');
require('./config/mongoose');
const app=express();

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:['GET','POST','DELETE','PUT'],
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Credentials','Authorization','Access-Control-Allow-Origin','Set-Cookie'],
    credentials:true
}))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://dreamy-sunshine-2eedbb.netlify.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

app.use('/api/v1/user',userRouter);
app.use('/api/v1/job',jobRouter);
app.use('/api/v1/application',applicationRouter);

app.use(errorMiddleware);

module.exports=app;
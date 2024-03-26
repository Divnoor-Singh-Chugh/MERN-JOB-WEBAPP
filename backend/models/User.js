const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config()
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [30, "Name cannot exceed 30 characters!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  phone:{
    type:Number,
    required:[true,"Please provide your phone number!"]
  },
  password:{
    type:String,
    required:[true,"Please provide your password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select:false
  },
  role:{
    type:String,
    required:[true,"Please provie your role!"],
    enum:['Job Seeker','Employer']
  }
},{
    timestamps:true
});

userSchema.pre('save', async function(next){
    if(!this.isModified("password"))
    {
        next();
    }
    this.password= await bcrypt.hash(this.password,8);
    next();
})

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

const User = mongoose.model("User", userSchema);

module.exports = User;

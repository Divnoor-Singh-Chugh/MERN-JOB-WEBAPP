const mongoose = require("mongoose");
const validator = require("validator");

const applicationSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [30, "Name must not exceed 30 characters!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide your cover letter!"],
  },
  phone: {
    type: Number,
    required: [true, "Please provide your phone no!"],
  },
  address: {
    type: String,
    required: [true, "Please provide your Address!"],
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url:{
        type: String,
        required: true,
    }
  },
  applicantID:{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    role:{
        type:String,
        enum:["Job Seeker"],
        required:true
    }
  },
  employerID:{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    role:{
        type:String,
        enum:["Employer"],
        required:true
    }
  }
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;

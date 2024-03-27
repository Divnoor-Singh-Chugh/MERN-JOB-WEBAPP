const Application = require("../models/Application");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { errorHandler } = require("../middlewares/error");
const cloudinary = require("cloudinary");
const Job = require("../models/Job");

const employerGetAllApplications = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const { role, _id } = req.user;
  if (role === "Job Seeker") {
    return next(
      new errorHandler(
        "Job Seeker is not allowed to access these resources!",
        400
      )
    );
  }
  const applications = await Application.find({ "employerID.user": _id });
  res.json({ success: true, applications });
});

const jobseekerGetAllApplications = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const { role, _id } = req.user;
  if (role === "Employer") {
    return next(
      new errorHandler(
        "Employer is not allowed to access these resources!",
        400
      )
    );
  }
  const applications = await Application.find({ "applicantID.user": _id });
  res.json({ success: true, applications });
});

const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new errorHandler(
        "Employer is not allowed to access these resources!",
        400
      )
    );
  }
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new errorHandler("Oops application not found!", 404));
  }
  await application.deleteOne();
  res.json({
    success: true,
    message: "Application Deleted Successfully!",
  });
});

const postApplication = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new errorHandler(
        "Employer is not allowed to access these resources!",
        400
      )
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("Resume File Required!"));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/webp","image/jpeg"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new errorHandler(
        "Invalid file type. Please upload your resume in a PNG,JPG OR WEBP Format!",
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown cloudinary Error"
    );
    return next(new errorHandler("Failed to upload resume!", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return new errorHandler("Job not found!", 404);
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return new errorHandler("Job not found!", 404);
  }
  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new errorHandler("Please fill all field!", 400));
  }
  const application=await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
  })
  res.status(201).json({
   success:true,
   message:"Application Submitted",
   application
  })
});

module.exports = {
  employerGetAllApplications,
  jobseekerGetAllApplications,
  jobSeekerDeleteApplication,
  postApplication,
};

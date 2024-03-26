const { catchAsyncError } = require("../middlewares/catchAsyncError");
const Job = require("../models/Job");
const { errorHandler } = require("../middlewares/error");

const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.json({ success: true, jobs });
});

const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Job Seeker") {
    return next(
      new errorHandler(
        "Job Seeker is not allowed to access these resources!",
        400
      )
    );
  }

  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new errorHandler("Please provide full job details", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new errorHandler("Please either provide fixed salary or ranged salary")
    );
  }
  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new errorHandler("cannot enter fixed salary and ranged salary together")
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(201).json({
    success: true,
    message: "Job posted successfully!",
    job,
  });
});

const getmyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new errorHandler(
        "Job Seeker is not allowed to access these resources!",
        400
      )
    );
  }

  const myJobs = await Job.find({ postedBy: req.user._id });
  res.json({ success: true, myJobs });
});

const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new errorHandler(
        "Job Seeker is not allowed to access these resources!",
        400
      )
    );
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new errorHandler("Oops Job not found!...", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.json({ success: true, job, message: "Job Updated Successfully" });
});

const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new errorHandler(
        "Job Seeker is not allowed to access these resources!",
        400
      )
    );
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new errorHandler("Oops Job not found!...", 404));
  }
  await job.deleteOne();
  res.json({
    success: true,
    message: "Job Deleted successfully!",
  });
});

const getSinglejob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    console.log(job);
    if (!job) {
      return next(new errorHandler("Job not found!", 404));
    }
    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    return next(new errorHandler("Invalid ID/ CastError", 400));
  }
});

module.exports = {
  getAllJobs,
  postJob,
  getmyJobs,
  updateJob,
  deleteJob,
  getSinglejob,
};

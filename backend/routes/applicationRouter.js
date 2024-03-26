const express = require("express");
const {isAuthorized}=require('../middlewares/auth');
const {
  employerGetAllApplications,
  jobSeekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication
} = require("../controllers/applicationController");
const router = express.Router();


router.get("/jobseeker/getall",isAuthorized,jobseekerGetAllApplications)
router.get("/employer/getall",isAuthorized,employerGetAllApplications)
router.delete("/delete/:id",isAuthorized,jobSeekerDeleteApplication)
router.post('/post',isAuthorized,postApplication)



module.exports = router;

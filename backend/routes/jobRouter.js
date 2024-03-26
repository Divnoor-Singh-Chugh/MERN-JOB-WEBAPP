const express=require('express');
const router=express.Router();
const {getAllJobs, postJob,getmyJobs,updateJob,deleteJob,getSinglejob}=require('../controllers/jobController');
const { isAuthorized } = require('../middlewares/auth');

router.get('/getall',getAllJobs);
router.post('/post',isAuthorized,postJob);
router.get('/getmyjobs',isAuthorized,getmyJobs)
router.put('/update/:id',isAuthorized,updateJob)
router.delete('/delete/:id',isAuthorized,deleteJob)
router.get("/:id",isAuthorized,getSinglejob)

module.exports=router;
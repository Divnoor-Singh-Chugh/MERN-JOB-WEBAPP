const express=require('express');
const {register,login,logout,getUser}=require('../controllers/userController');
const {isAuthorized} =require('../middlewares/auth');
const router=express.Router();

router.post('/register',register)
router.post('/login',login);
router.get('/logout',isAuthorized,logout);
router.get('/getuser',isAuthorized,getUser)

module.exports=router;
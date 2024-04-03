const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { errorHandler } = require("../middlewares/error");
const User = require("../models/User");
const { sendToken } = require("../utils/jwtToken");

const register = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !phone || !role || !password) {
    return next(new errorHandler("Please fill full registration form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new errorHandler("Email already exists!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    role,
    password,
  });

  sendToken(user, 201, res, "User registered successfully!");
});

const login = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const { email, role, password } = req.body;
  if (!email || !role || !password) {
    return next(
      new errorHandler("Please provide email,password and role!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorHandler("Invalid email or password", 400));
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    return next(new errorHandler("Invalid email or password", 400));
  }
  if (user.role !== role) {
    return next(new errorHandler("User with this role not found", 404));
  }
  sendToken(user, 200, res, "User logged in successfully!");
});

const logout = catchAsyncError(async (req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Set-Cookie', `token="";  Secure; SameSite=None; Expires=${new Date(Date.now()).toUTCString()}`);
  res
    .status(201)
    .cookie("token", "", {
      secure: true,
      SameSite:'None',
      domain: 'https://dreamy-sunshine-2eedbb.netlify.app', 
      path: '/',
      expires: new Date(Date.now()),
    })
    .json({ success: true, message: "User logged out successfully!" });
});

const getUser = catchAsyncError((req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  const user = req.user;
  res.json({ success: true, user });
});

module.exports = { register, login, logout, getUser };

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("There is no token attacked in headers");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  let { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not admin");
  } else {
    next();
  }
});
module.exports = { authMiddleware, isAdmin };

const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signinWithGoogle,
  getInfo,
  changePassword,
  forgotPasswordToken,
  resetPassword,
  changeProfile,
  searchUsers,
  countSearchUsers,
  changeProfileImg,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authMiddleware.js");
router.get("/get-profile/:username", getInfo);
router.get("/search/:query", searchUsers);
router.get("/count-search-users/:query", countSearchUsers);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPasswordToken);
router.post("/signin-with-google", signinWithGoogle);

router.put("/change-password", authMiddleware, changePassword);
router.put("/reset-password/:token", resetPassword);
router.put("/change-profile", authMiddleware, changeProfile);
router.put("/change-profile-img", authMiddleware, changeProfileImg);
module.exports = router;

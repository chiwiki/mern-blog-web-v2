const { signupValidation } = require("../validations/signupValidation.js");
const bcypt = require("bcrypt");
const User = require("../models/user.model.js");
const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const { signinValidation } = require("../validations/signinValidation.js");
const {
  googleAuthValidation,
} = require("../validations/signinWithGoogleValidation");
const { sendEmail } = require("./email.controller.js");
var that = (module.exports = {
  signup: asyncHandler(async (req, res) => {
    try {
      const newUser = await signupValidation(req.body);
      res.json(newUser);
    } catch (err) {
      throw new Error(err);
    }
  }),
  signin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await signinValidation(email, password);
      res.json(user);
    } catch (error) {
      throw new Error(error);
    }
  }),
  signinWithGoogle: asyncHandler(async (req, res) => {
    const { access_token } = req.body;
    try {
      const newUser = await googleAuthValidation(access_token);
      res.json(newUser);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getInfo: asyncHandler(async (req, res) => {
    let { username } = req.params;
    console.log("usernmae: ", username);
    try {
      const user = await User.findOne({
        "personal_info.username": username,
      }).select("-google_auth -personal_info.password  -blogs -updatedAt");
      res.json({ user });
    } catch (error) {
      throw new Error(error);
    }
  }),
  changePassword: asyncHandler(async (req, res) => {
    console.log("change password");
    const { _id: user_id } = req.user;
    const { currentPassword, newPassword } = req.body;
    console.log(req.body);
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    try {
      if (
        !passwordRegex.test(currentPassword) ||
        !passwordRegex.test(newPassword)
      ) {
        throw new Error(
          "Password have to 6-20 character, including at least 1 uppercase, 1 lower case and 1 special character"
        );
      }
      const user = await User.findOne({ _id: user_id });
      if (user.google_auth) {
        throw new Error("this account signed up by google");
      }
      bcypt.compare(
        currentPassword,
        user.personal_info.password,
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Something went wrong!",
              success: false,
            });
          }
          if (!result) {
            return res.status(400).json({
              message: "password is not match",
              success: false,
            });
          }

          bcypt.hash(newPassword, 10, async (err, hashedPassword) => {
            await User.findOneAndUpdate(
              { _id: user_id },
              { "personal_info.password": hashedPassword }
            );
            res.json("change password successfully!");
          });
          console.log(result);
        }
      );
    } catch (error) {
      throw new Error(error);
    }
  }),
  forgotPasswordToken: asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ "personal_info.email": email });
      if (!user) {
        throw new Error("User not found with this email");
      }
      if (user.google_auth) {
        throw new Error("this account singed up with google");
      }
      const token = await user.createPasswordResetToken();
      console.log("token:   ", token);
      await user.save();
      const url = `http://localhost:5173/reset-password/${token}`;
      const resetURL = `hi, Please follow this link to reset your password. This link is vaid till 10 minutes from now. <a href=${url}>click here</a>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot password link",
        html: resetURL,
      };
      await sendEmail(data);
      res.json({ token: token });
    } catch (error) {
      throw new Error(error.message);
    }
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Token Expired. Please try again later");
    }
    bcypt.hash(password, 10, async (err, hashedPassword) => {
      user.personal_info.password = hashedPassword;
      await user.save();
    });
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json("updated password");
  }),
  changeProfileImg: asyncHandler(async (req, res) => {
    const { profile_img } = req.body;
    const { _id } = req.user;
    try {
      const user = await User.findOneAndUpdate(
        { _id },
        { "personal_info.profile_img": profile_img }
      );
      res.json({ status: "Upload image successfully!" });
    } catch (error) {
      throw new Error(error);
    }
  }),
  changeProfile: asyncHandler(async (req, res) => {
    const { username, social_links, bio } = req.body;
    const { _id } = req.user;
    console.log("username: ", username);
    if (username && username.length < 3) {
      throw new Error("username must be greater than 3 letters");
    }
    if (bio && bio.length > 150) {
      throw new Error("Bio length should be less than 150 characters");
    }

    try {
      const existUser = await User.exists({
        "personal_info.username": username,
      });
      if (existUser._id.toString() !== _id.toString()) {
        throw new Error("username already exist");
      }

      console.log("hhfhfhf");

      const updatedUser = await User.findOneAndUpdate(
        { _id },
        {
          "personal_info.username": username,
          "personal_info.bio": bio,
          social_links,
        },
        { new: true }
      );
      console.log("updatedUser: ", updatedUser);
      res.json(updatedUser);
    } catch (error) {
      throw new Error(error);
    }
  }),
  searchUsers: asyncHandler(async (req, res) => {
    const { query } = req.params;
    try {
      const users = await User.find({
        "personal_info.username": new RegExp(query, "i"),
      }).select("-blogs -google_auth -password -social_links -account_info ");
      res.json({ users });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
  countSearchUsers: asyncHandler(async (req, res) => {
    const { query } = req.params;
    try {
      const users = await User.countDocuments({
        "personal_info.username": new RegExp(query, "i"),
      });
      res.json({ totalDocs });
    } catch (error) {
      throw new Error(error.message);
    }
  }),
});

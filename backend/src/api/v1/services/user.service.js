const User = require("../models/user.model.js");

const jwt = require("jsonwebtoken");

module.exports = {
  generateUsername: async (email) => {
    try {
      let username = email.split("@")[0];

      let isUniqueUsername = await User.exists({
        "personal_info.username": username,
      }).then((result) => result);

      !isUniqueUsername
        ? ""
        : (username += Math.floor(Math.random() * 1000000));
      return username;
    } catch (err) {}
  },

  formatUser: (user) => {
    const access_token = jwt.sign(
      { id: user._id },
      process.env.SECRET_ACCESS_KEY
    );

    return {
      access_token,
      profile_img: user.personal_info.profile_img,
      email: user.personal_info.email,
      username: user.personal_info.username,
    };
  },
};

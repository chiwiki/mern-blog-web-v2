const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { formatUser } = require("../services/user.service");
var that = (module.exports = {
  signinValidation: (email, password) => {
    return new Promise((resolve, reject) => {
      User.findOne({ "personal_info.email": email }).then((user) => {
        if (!user) {
          reject("Email không tồn tại trong hệ thống");
        } else {
          if (!user.google_auth) {
            bcrypt.compare(
              password,
              user.personal_info.password,
              (err, result) => {
                if (err) {
                  reject(err.message);
                }
                if (!result) {
                  reject("Sai mật khẩu");
                } else {
                  resolve(formatUser(user));
                }
              }
            );
          } else {
            reject("Email đã được đăng nhập bởi google");
          }
        }
      });
    });
  },
});

const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { generateUsername, formatUser } = require("../services/user.service");
var that = (module.exports = {
  signupValidation: (info) => {
    return new Promise((resolve, reject) => {
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
      let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

      let { fullname, password, email } = info;
      if (fullname.length < 3) {
        reject("Tên đầy đủ phải nhiều hơn 3 ký tự");
      }
      if (!email.length) {
        reject("Nhập email");
      }
      if (!passwordRegex.test(password)) {
        reject(
          "Mật khẩu phải chứa từ 6-20 ký tự bao gồm chữ hoa, chữ thường số và ký tự đặc biệt"
        );
      }
      if (!emailRegex.test(email)) {
        reject("Email bạn nhập không hợp lệ");
      }
      bcrypt.hash(password, 10, async (err, hashed_password) => {
        try {
          let username = await generateUsername(email);
          let user = new User({
            personal_info: {
              fullname,
              username,
              email,
              password: hashed_password,
            },
          });
          const newUser = await user.save();
          resolve(formatUser(newUser));
        } catch (error) {
          if (error.code === 11000) {
            reject("Email already exist");
          }
          reject(error.message);
        }
      });
    });
  },
});

const User = require("../models/user.model");
const { getAuth } = require("firebase-admin/auth");
const { use } = require("../routes/user.route");
const { generateUsername, formatUser } = require("../services/user.service");

var that = (module.exports = {
  googleAuthValidation: (access_token) => {
    return new Promise((resolve, reject) => {
      getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {
          console.log("decodedUser: ", decodedUser);
          let { email, name, picture } = decodedUser;
          picture = picture.replace("s96-c", "s384-c");
          console.log(email, name, picture);

          let user = await User.findOne({ "personal_info.email": email })
            .select(
              "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
            )
            .then((u) => {
              return u || null;
            })
            .catch((err) => {
              reject(err.message);
            });
          //console.log("user: ", user);
          if (user) {
            console.log("user: ", user);
            if (!user.google_auth) {
              reject(
                "Email này đã được đăng ký. Vui lòng quay lại nhập email và mật khẩu để đăng nhập"
              );
            } else {
              resolve(formatUser(user));
            }
          } else {
            let username = await generateUsername(email);
            console.log("username:", username);
            let newUser = new User({
              personal_info: {
                email,
                fullname: name,
                username,
                profile_img: picture,
              },
              google_auth: true,
            });

            await newUser
              .save()
              .then((u) => {
                newUser = u;
                resolve(formatUser(newUser));
              })
              .catch((err) => {
                reject(err.message);
              });
          }
        })
        .catch((err) => {
          reject("Lỗi xác thực với google. Hãy thử tài khoản khác!");
        });
    });
  },
});

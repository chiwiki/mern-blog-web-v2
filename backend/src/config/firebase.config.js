var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccount.json");

const firebaseAccountService = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};
module.exports = firebaseAccountService;

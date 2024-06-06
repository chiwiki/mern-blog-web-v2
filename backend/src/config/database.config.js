const mongoose = require("mongoose");
const dotenv = require("dotenv/config");

const conection = (db) => {
  mongoose
    .connect(db, {
      autoIndex: true,
    })
    .then(() => console.log("conect to database successfully!"))
    .catch((error) => console.log(error.message));
};
module.exports = conection;

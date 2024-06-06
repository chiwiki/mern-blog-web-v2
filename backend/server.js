const express = require("express");
const { json } = require("express");
const dotenv = require("dotenv/config");
const cors = require("cors");
const PORT = process.env.PORT || 8081;
const server = express();

const conection = require("./src/config/database.config");
const firebaseAccountService = require("./src/config/firebase.config");
server.use(express.json());
server.use(cors());
const userRoute = require("./src/api/v1/routes/user.route");
const blogRoute = require("./src/api/v1/routes/blog.route");
const commentRoute = require("./src/api/v1/routes/comment.route");
const notificationRoute = require("./src/api/v1/routes/notification.route");

const DATABASE_URL = process.env.DB_URL;
conection(DATABASE_URL);

firebaseAccountService();

server.get("/", (req, res) => {
  return res.status(200).json({ status: "Xin chao" });
});

const {
  notFound,
  errorHandler,
} = require("./src/api/v1/middleware/errorHandler");

server.use("/api/v1/users", userRoute);
server.use("/api/v1/blogs", blogRoute);
server.use("/api/v1/comments", commentRoute);
server.use("/api/v1/notifications", notificationRoute);
server.use(notFound);
server.use(errorHandler);
server.listen(PORT, () => {
  console.log(`listening on the port-->${process.env.PORT}`);
});

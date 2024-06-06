const { Server } = require("socket.io");
require("dotenv").config();
const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log("A client connected");
  socket.on("newUser", ({ username }) => {
    addNewUser(username, socket.id);
    console.log("online users: ", onlineUsers);
  });

  socket.on("interact", (data) => {
    console.log(data);
    const user = getUser(data.notification_for);

    console.log(`${data.type} for user: `, user ? user : "offline user");
    if (data.notification_for !== data.user.personal_info.username) {
      io.to(user?.socketId).emit("sendNotification", data);
    }
    // io.to(user?.socketId).emit("sendNotification", data);
  });
  socket.on("deleteInteraction", (data) => {
    console.log(data.message);
    const user = getUser(data.notification_for);
    io.to(user?.socketId).emit("deleteNotification", {
      message: "cancel like",
    });
  });
  socket.on("typing", (data) => {
    console.log(data.message);
    socket.broadcast.emit("sendTyping", data);
  });

  socket.on("comment", (data) => {
    socket.broadcast.emit("sendComment", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("remove online users: ", onlineUsers);
    console.log("someone has left");
  });
});

io.listen(3001, () => {
  console.log("socket is listening on port 3001");
});

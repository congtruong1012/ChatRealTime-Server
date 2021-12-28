const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const messageRoute = require("./routes/message.route");
const channelRoute = require("./routes/channel.route");
const checkToken = require("./middlewares/check-token");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connect success !!");
  } catch (error) {
    console.log("connect fail !", error);
  }
};

connectDb();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: true,
});

app.use(cors({ credentials: true, origin: true }));

app.use(bodyParser());

app.use(cookieParser());

let users = [];

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    if (!users.some((user) => user.userId === userId))
      users.push({ userId, socketId: socket?.id });
    console.log("socket.on ~ users", users);
    io.emit("get-users", users);
  });

  socket.on("send-message", (data) => {
    const dataMessage = { ...data, time: Date.now() };
    const { to } = dataMessage;
    const user = users.find((item) => item.userId === to);
    if (user) {
      io.to(user?.socketId).emit("receive-message", dataMessage);
    }
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket?.id);
    io.emit("get-users", users);
  });
});

app.use("/api", userRoute);
app.use("/api/message", checkToken, messageRoute);
app.use("/api/channel", checkToken, channelRoute);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

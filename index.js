const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/user.route");
const messageRoute = require("./routes/message.route");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://congtruong1012:01627845641@cluster0.iuy6e.mongodb.net/ChatRealTime?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
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

app.use(bodyParser());

app.use(cookieParser());

io.on("connection", (socket) => {
  socket.on("send-message", (data) => {
    socket.emit("receive-message", data);
  });
});

app.use("/api", userRoute);
app.use("/api/message", messageRoute);

httpServer.listen(4000, () => {
  console.log("Listening on port 4000");
});

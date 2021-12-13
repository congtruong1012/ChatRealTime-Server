const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://congtruong1012:01627845641@cluster0.iuy6e.mongodb.net/ChatRealTime?retryWrites=true&w=majority",
  function (err, db) {
    if (err) {
      console.log("Unable to connect to the mongoDB server. Error:", err);
    } else {
      //HURRAY!! We are connected. :)
      console.log("Connection established to");

      // do some work here with the database.

      //Close connection
      db.close();
    }
  }
);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: true,
});

io.on("connection", (socket) => {
  socket.on("send-message", (data) => {
    socket.emit("receive-message", data);
  });
});

httpServer.listen(4000, () => {
  console.log("Listening on port 4000");
});

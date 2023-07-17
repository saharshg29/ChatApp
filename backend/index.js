const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chats = require("../backend/data/data");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
app.use(cors());
const path = require("path");

dotenv.config();

connectDB();

app.use(express.json()); // To allow acces to json

notFound;

// including the db

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ----------------------------------DEPLOYEMENT------------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(__dirname1, "frontend", "build", "index.html");
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}
// ----------------------------------DEPLOYEMENT------------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`server started at ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connectd");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("server ki main file me line no 61");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

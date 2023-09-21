const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chats = require("../backend/data/data");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require('./routes/messageRoutes')
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
app.listen(PORT, console.log(`server started at ${PORT}`));

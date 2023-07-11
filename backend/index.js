const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
const chats = require("../backend/data/data");
const app = express();

app.use(cors())

dotenv.config();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
  console.log("/api/chat is being called");
});

app.get("/api/chat/:id", (req, res) => {
  let singleChat = chats.find((c) => (c._id = req.params.id));
  res.send(singleChat)
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started at ${PORT}`));

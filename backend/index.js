const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv");
const chats = require("../backend/data/data");
const app = express();
const userRoutes = require("./routes/userRoutes")
const connectDB = require("./config/db")
app.use(cors())

dotenv.config();

connectDB()
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started at ${PORT}`));

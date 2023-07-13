const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chats = require("../backend/data/data");
const app = express();
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
app.use(cors());

dotenv.config();

connectDB();

app.use(express.json()); // To allow acces to json
app.get("/", (req, res) => {
  res.send("API is running");
});
notFound;

// including the db

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started at ${PORT}`));

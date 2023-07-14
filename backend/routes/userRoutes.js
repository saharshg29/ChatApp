const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
// router.get("/", protect, allUsers);

module.exports = router;

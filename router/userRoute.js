const express = require("express");
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const router = express.Router();

router.post("/user", registerUser);
router.get("/user", getUsers);
router.get("/user/:userId", getUserById);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

module.exports = router;

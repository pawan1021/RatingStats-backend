const express = require("express");
const router = express.Router();
const { loginUser, signupUser, updatePassword } = require("../controllers/authControllers");

// Auth routes
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.put("/update-password/:userId", updatePassword); // userId from URL

module.exports = router;

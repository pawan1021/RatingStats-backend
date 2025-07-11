const express = require("express");
const router = express.Router();
const {
  createUser,
  createStore,
  getDashboardStats,
  getAllUsers,
  getAllStores,
} = require("../controllers/adminController");

// Admin-only routes
router.post("/users", createUser);
router.post("/stores", createStore);
router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/stores", getAllStores);

module.exports = router;

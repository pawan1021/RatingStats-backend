const express = require("express");
const router = express.Router();
const { getAllStores } = require("../controllers/storeController");

router.get("/", getAllStores); // GET /api/stores

module.exports = router;

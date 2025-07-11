const express = require("express");
const router = express.Router();
const {
  getAllStores,
  submitOrUpdateRating,
} = require("../controllers/userController");

router.get("/stores", getAllStores);
router.post("/ratings", submitOrUpdateRating);

module.exports = router;

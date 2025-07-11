const express = require("express");
const router = express.Router();
const { submitRating } = require("../controllers/ratingController");

router.post("/", submitRating);

module.exports = router;

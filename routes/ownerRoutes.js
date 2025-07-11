const express = require("express");
const router = express.Router();
const {
  getOwnerStores,
  getStoreRatings,
} = require("../controllers/ownerController");

router.get("/store/:ownerId", getOwnerStores);
router.get("/store/:storeId/ratings", getStoreRatings);

module.exports = router;

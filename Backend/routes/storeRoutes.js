const express = require("express");
const { getAllStores, getStoreById, createStore, getStoreRatings } = require("../controllers/storeController");
const { authenticate, authorizeAdmin, authorizeStoreOwner } = require("../middleware/authMiddleware")

const router = express.Router();

// Public
router.get("/", getAllStores);
router.get("/:id", getStoreById);

// Admin
router.post("/", authenticate, authorizeAdmin, createStore);

// Store owner
router.get("/:id/ratings", authenticate, authorizeStoreOwner, getStoreRatings);

module.exports = router;

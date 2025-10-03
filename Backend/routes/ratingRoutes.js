// routes/ratingRoutes.js
const express = require("express");
const { addRating, updateRating, getRatings } = require("../controllers/ratingController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();


// GET all ratings - Required for Admin Dashboard
router.get("/", authenticate, getRatings);

// POST: Submit new rating
router.post("/", authenticate, addRating);

// PUT: Update existing rating by ID
router.put("/:id", authenticate, updateRating);

module.exports = router;
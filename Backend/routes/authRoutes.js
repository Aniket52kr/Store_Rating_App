const express = require("express");
const { registerUser, loginUser, updatePassword } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.put("/update-password", authenticate, updatePassword);

module.exports = router;


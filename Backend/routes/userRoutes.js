const express = require("express");
const { getAllUsers, getUserById, createUser } = require("../controllers/userController");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin only
router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.get("/:id", authenticate, authorizeAdmin, getUserById);
router.post("/", authenticate, authorizeAdmin, createUser);

module.exports = router;

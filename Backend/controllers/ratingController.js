// controllers/ratingController.js
const pool = require("../config/db");

// Submit a new rating
const addRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    // Validate rating
    if (!store_id || typeof store_id !== 'number') {
      return res.status(400).json({ message: "Valid store_id is required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Insert or update using ON DUPLICATE KEY
    await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
      [req.user.id, store_id, rating, rating]
    );

    // Fetch the actual rating ID
    const [rows] = await pool.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [req.user.id, store_id]
    );

    if (rows.length === 0) {
      // Very unlikely, but catch edge case
      return res.status(500).json({
        message: "Rating saved, but could not retrieve ID"
      });
    }

    const ratingId = rows[0].id;

    // Return success + rating ID
    res.status(201).json({
      message: "Rating submitted successfully",
      ratingId: ratingId
    });
  } catch (error) {
    console.error("Error in addRating:", error);
    res.status(500).json({
      message: "Failed to submit rating",
      error: error.message
    });
  }
};

// Update existing rating
const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const ratingId = req.params.id;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const [result] = await pool.query(
      "UPDATE ratings SET rating = ? WHERE id = ? AND user_id = ?",
      [rating, ratingId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Rating not found or you don't have permission to edit it"
      });
    }

    res.json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error in updateRating:", error);
    res.status(500).json({
      message: "Failed to update rating",
      error: error.message
    });
  }
};

// Get all ratings (for admin dashboard)
const getRatings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id,
        r.user_id,
        r.store_id,
        r.rating,
        u.name AS user_name,
        u.email AS user_email,
        s.name AS store_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      JOIN stores s ON r.store_id = s.id
      ORDER BY r.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Database error in getRatings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

// Export all functions
module.exports = { 
  addRating, 
  updateRating,
  getRatings  
};
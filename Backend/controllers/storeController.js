// controllers/storeController.js
const pool = require("../config/db");

const getAllStores = async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT 
        s.id, 
        s.name, 
        s.email,
        s.address, 
        IFNULL(AVG(r.rating), 0) AS overall_rating,
        s.owner_id
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM stores WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Store not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new store and optionally assign an owner
const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    // Validate required fields
    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }

    let ownerIdToInsert = null;

    // If owner_id is provided, validate that the user exists and is a store_owner
    if (owner_id) {
      const [users] = await pool.query(
        "SELECT id, role FROM users WHERE id = ?",
        [owner_id]
      );

      if (users.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      if (users[0].role !== 'store_owner') {
        return res.status(400).json({ message: "User must have 'store_owner' role" });
      }

      ownerIdToInsert = users[0].id;
    }

    // Insert store with optional owner_id
    await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, ownerIdToInsert]
    );

    res.status(201).json({ message: "Store created successfully" });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Failed to create store", error: error.message });
  }
};

// Get all ratings for a specific store (with ownership check)
const getStoreRatings = async (req, res) => {
  const { id: storeId } = req.params;
  const { id: userId, role } = req.user;

  // Admin can view ratings for any store
  if (role === 'admin') {
    try {
      const [ratings] = await pool.query(
        "SELECT u.name, u.email, r.rating FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ?",
        [storeId]
      );
      return res.json(ratings);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch ratings", error: error.message });
    }
  }

  // Store Owner: Must own this store
  try {
    const [store] = await pool.query(
      "SELECT id FROM stores WHERE id = ? AND owner_id = ?",
      [storeId, userId]
    );

    if (store.length === 0) {
      return res.status(403).json({
        message: "Access denied: You do not own this store or it does not exist"
      });
    }

    // Fetch ratings for owned store
    const [ratings] = await pool.query(
      "SELECT u.name, u.email, r.rating FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.store_id = ?",
      [storeId]
    );

    res.json(ratings);
  } catch (error) {
    console.error("Database error in getStoreRatings:", error);
    res.status(500).json({ message: "Failed to fetch ratings", error: error.message });
  }
};

// Export all functions
module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  getStoreRatings,
};
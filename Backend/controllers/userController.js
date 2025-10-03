const pool = require("../config/db.js");

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email, address, role FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    await pool.query(
      "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, address, password, role]
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions
module.exports = { 
    getAllUsers, 
    getUserById, 
    createUser 
};

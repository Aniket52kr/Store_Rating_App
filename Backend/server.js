const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

dotenv.config();

const app = express();

// Allow multiple origins
const allowedOrigins = [
    'http://localhost:5173',   // Vite dev server
    'http://localhost:3000',   // Dockerized frontend
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/ratings", ratingRoutes);



// Test DB connection
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() as now");
        res.json({ success: true, server_time: rows[0].now });
    } catch (error) {
        console.error("DB connection error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

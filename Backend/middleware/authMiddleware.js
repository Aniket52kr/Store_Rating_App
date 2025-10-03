const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    console.warn("[Auth] No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  // Log for debugging (remove in production)
  console.log("[Auth] Received Token:", token.substring(0, 20) + "...");

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, user) => {
    if (err) {
      console.error("[Auth] Token Verification Failed:", err.message);

      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token format" });
      } else if (err.name === "NotBeforeError") {
        return res.status(403).json({ message: "Token not yet valid" });
      }

      return res.status(403).json({ message: "Invalid or malformed token" });
    }

    // console.log("[Auth] Token verified successfully for user:", user);
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    console.warn("[Auth] Access denied: Admins only. User role:", req.user?.role);
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

const authorizeStoreOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "store_owner") {
    console.warn("[Auth] Access denied: Store owners only. User role:", req.user?.role);
    return res.status(403).json({ message: "Access denied: Store owners only" });
  }
  next();
};

// Export all functions
module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeStoreOwner,
};
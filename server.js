const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load route files
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const userRoutes = require("./routes/userROutes"); // ✅ typo fixed
const storeRoutes = require("./routes/storeRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

// Register routes with base paths
app.use("/api/auth", authRoutes);        // 🔐 Auth routes (login, signup, password)
app.use("/api/admin", adminRoutes);      // 🛡 Admin routes
app.use("/api/ratings", ratingRoutes);   // ⭐ Ratings (POST)
app.use("/api", userRoutes);             // 👤 User data (if any global)
app.use("/api/stores", storeRoutes);     // 🏪 Normal user store listing
app.use("/api/owner", ownerRoutes);      // 🧑‍💼 Store owner routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 📌 Create User (admin or normal)
exports.createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role)
    return res.status(400).json({ message: "All fields required." });

  const hashed = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, email, hashed, address, role], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res.status(400).json({ message: "Email already exists." });
      return res.status(500).json({ message: "DB error", err });
    }
    res.json({ message: "User created successfully." });
  });
};

// 📌 Create Store
exports.createStore = (req, res) => {
  const { name, email, address, ownerId } = req.body;

  if (!name || !email || !address || !ownerId)
    return res.status(400).json({ message: "All fields required." });

  const sql = `INSERT INTO stores (name, email, address, ownerId) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, address, ownerId], (err) => {
    if (err) return res.status(500).json({ message: "Error adding store", err });
    res.json({ message: "Store added successfully." });
  });
};

// 📌 Dashboard Stats
exports.getDashboardStats = (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM stores) AS totalStores,
      (SELECT COUNT(*) FROM ratings) AS totalRatings
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error loading stats", err });
    res.json(results[0]);
  });
};

// 📌 Get All Users (with filter)
exports.getAllUsers = (req, res) => {
  const { name = "", email = "", role = "", address = "" } = req.query;

  const sql = `
    SELECT id, name, email, address, role
    FROM users
    WHERE name LIKE ? AND email LIKE ? AND role LIKE ? AND address LIKE ?
  `;

  db.query(
    sql,
    [`%${name}%`, `%${email}%`, `%${role}%`, `%${address}%`],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Failed to fetch users", err });
      res.json(results);
    }
  );
};

// 📌 Get All Stores (with avg rating + filter)
exports.getAllStores = (req, res) => {
  const { name = "", email = "", address = "" } = req.query;

  const sql = `
    SELECT 
      s.id, s.name, s.email, s.address,
      ROUND(AVG(r.ratingValue), 2) AS averageRating,
      COUNT(r.id) AS totalRatings
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.storeId
    WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
    GROUP BY s.id
  `;

  db.query(
    sql,
    [`%${name}%`, `%${email}%`, `%${address}%`],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Failed to fetch stores", err });
      res.json(results);
    }
  );
};

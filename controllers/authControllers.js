const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Helper: validate password
const validatePassword = (password) => {
  return /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(password);
};

// ✅ Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", err });

    if (results.length === 0) return res.status(401).json({ message: "Invalid email" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};

// ✅ Signup
exports.signupUser = async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password || !address)
    return res.status(400).json({ message: "All fields are required." });

  if (name.length < 20 || name.length > 60)
    return res.status(400).json({ message: "Name must be 20-60 characters." });

  if (address.length > 400)
    return res.status(400).json({ message: "Address max 400 characters." });

  if (!validatePassword(password))
    return res.status(400).json({
      message: "Password must be 8–16 characters, include 1 uppercase and 1 special character."
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'user')";
  db.query(sql, [name, email, hashedPassword, address], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already registered." });
      }
      return res.status(500).json({ message: "DB error", err });
    }
    res.json({ message: "Signup successful" });
  });
};

// ✅ Password Update
exports.updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ message: "Both passwords are required." });

  if (!validatePassword(newPassword))
    return res.status(400).json({
      message: "New password must be 8–16 characters, include 1 uppercase and 1 special character."
    });

  const getUser = "SELECT * FROM users WHERE id = ?";
  db.query(getUser, [userId], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password." });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    const updateSql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(updateSql, [hashedNew, userId], (err) => {
      if (err) return res.status(500).json({ message: "Failed to update password." });
      res.json({ message: "Password updated successfully." });
    });
  });
};

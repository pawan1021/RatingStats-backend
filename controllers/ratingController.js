const db = require("../config/db");

exports.submitRating = (req, res) => {
  const { storeId, ratingValue, creatorId } = req.body;

  if (!storeId || !ratingValue || !creatorId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if user already rated this store
  const checkSql = `SELECT * FROM ratings WHERE storeId = ? AND creatorId = ?`;

  db.query(checkSql, [storeId, creatorId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", err });

    if (rows.length > 0) {
      // Update existing rating
      const updateSql = `UPDATE ratings SET ratingValue = ? WHERE storeId = ? AND creatorId = ?`;
      db.query(updateSql, [ratingValue, storeId, creatorId], (err) => {
        if (err) return res.status(500).json({ message: "Update failed", err });
        res.json({ message: "Rating updated" });
      });
    } else {
      // Insert new rating
      const insertSql = `INSERT INTO ratings (storeId, ratingValue, creatorId) VALUES (?, ?, ?)`;
      db.query(insertSql, [storeId, ratingValue, creatorId], (err) => {
        if (err) return res.status(500).json({ message: "Insert failed", err });
        res.json({ message: "Rating submitted" });
      });
    }
  });
};

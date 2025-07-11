const db = require("../config/db");

// GET /api/stores?userId=3
exports.getAllStores = (req, res) => {
  const userId = req.query.userId;

  const sql = `
    SELECT 
      s.id, s.name, s.address,
      IFNULL(ROUND(AVG(r.ratingValue), 1), 0) AS averageRating,
      COUNT(r.id) AS totalRatings,
      (
        SELECT ratingValue FROM ratings
        WHERE storeId = s.id AND creatorId = ?
        LIMIT 1
      ) AS yourRating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.storeId
    GROUP BY s.id
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", err });
    res.json(result);
  });
};

// POST /api/ratings
exports.submitOrUpdateRating = (req, res) => {
  const { storeId, ratingValue, creatorId } = req.body;

  if (!storeId || !ratingValue || !creatorId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const checkSql = "SELECT * FROM ratings WHERE storeId = ? AND creatorId = ?";
  db.query(checkSql, [storeId, creatorId], (err, rows) => {
    if (err) return res.status(500).json({ message: "Check failed", err });

    if (rows.length > 0) {
      const updateSql = "UPDATE ratings SET ratingValue = ? WHERE storeId = ? AND creatorId = ?";
      db.query(updateSql, [ratingValue, storeId, creatorId], (err) => {
        if (err) return res.status(500).json({ message: "Update failed", err });
        res.json({ message: "Rating updated." });
      });
    } else {
      const insertSql = "INSERT INTO ratings (storeId, ratingValue, creatorId) VALUES (?, ?, ?)";
      db.query(insertSql, [storeId, ratingValue, creatorId], (err) => {
        if (err) return res.status(500).json({ message: "Insert failed", err });
        res.json({ message: "Rating submitted." });
      });
    }
  });
};

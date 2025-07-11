const db = require("../config/db");

// GET /api/owner/store/:ownerId
exports.getOwnerStores = (req, res) => {
  const ownerId = req.params.ownerId;

  const sql = `
    SELECT 
      s.id, s.name, s.address, s.email,
      ROUND(AVG(r.ratingValue), 2) AS averageRating,
      COUNT(r.id) AS totalRatings
    FROM stores s
    LEFT JOIN ratings r ON r.storeId = s.id
    WHERE s.ownerId = ?
    GROUP BY s.id
  `;

  db.query(sql, [ownerId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to get store", err });
    res.json(results);
  });
};

// GET /api/owner/store/:storeId/ratings
exports.getStoreRatings = (req, res) => {
  const storeId = req.params.storeId;

  const sql = `
    SELECT 
      u.name AS userName,
      u.email,
      r.ratingValue,
      r.date
    FROM ratings r
    JOIN users u ON u.id = r.creatorId
    WHERE r.storeId = ?
    ORDER BY r.date DESC
  `;

  db.query(sql, [storeId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch ratings", err });
    res.json(result);
  });
};

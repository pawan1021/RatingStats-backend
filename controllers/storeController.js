const db = require("../config/db");

exports.getAllStores = (req, res) => {
  const userId = req.query.userId;

  const sql = `
    SELECT 
      s.id, s.name, s.address,
      IFNULL(AVG(r.ratingValue), 0) AS averageRating,
      COUNT(r.id) AS totalRatings,
      (
        SELECT ratingValue
        FROM ratings
        WHERE creatorId = ?
        AND storeId = s.id
        LIMIT 1
      ) AS yourRating
    FROM stores s
    LEFT JOIN ratings r ON r.storeId = s.id
    GROUP BY s.id
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching stores:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.json(results);
  });
};

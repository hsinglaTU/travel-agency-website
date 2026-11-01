const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const data = await db.collection("packages").find().toArray();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching packages" });
    }
  });

  return router;
};

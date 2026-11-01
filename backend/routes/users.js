const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // SIGNUP
  router.post("/signup", async (req, res) => {
    try {
      const user = req.body;

      await db.collection("users").insertOne(user);

      res.json({ message: "User created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.collection("users").findOne({ email, password });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ message: "Login successful", name: user.name });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // GET USERS
  router.get("/", async (req, res) => {
    try {
      const users = await db.collection("users").find().toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Error fetching users" });
    }
  });

  return router;
};

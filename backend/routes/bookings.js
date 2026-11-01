const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const router = express.Router();

  // ===== CREATE BOOKING =====
  router.post("/", async (req, res) => {
    try {
      console.log("BODY:", req.body);

      const { packageId, people, userName } = req.body;

      // 🔴 1. LOGIN CHECK (CRITICAL)
      if (!userName) {
        return res.status(401).json({ error: "Login required" });
      }

      // 🔴 2. VALIDATION
      if (!packageId || packageId.length !== 24) {
        return res.status(400).json({ error: "Invalid packageId" });
      }

      if (!people || Number(people) <= 0) {
        return res.status(400).json({ error: "Invalid people count" });
      }

      const numPeople = Number(people);

      // 🔴 3. FETCH PACKAGE FROM DB (CRITICAL FIX)
      const pkg = await db.collection("packages").findOne({
        _id: new ObjectId(packageId),
      });

      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }

      // 🔴 4. CHECK AVAILABLE SLOTS
      if (pkg.availableSlots < numPeople) {
        return res.status(400).json({ error: "Not enough slots available" });
      }

      // ✅ 5. SAVE CLEAN DATA (NOT req.body directly)
      await db.collection("bookings").insertOne({
        userName,
        packageId,
        packageName: pkg.title, // ✅ FIXED
        price: pkg.price, // ✅ BONUS
        people: numPeople,
        travelDate: req.body.travelDate,
        payment: req.body.payment,
        createdAt: new Date(),
      });

      // ✅ 6. REDUCE SLOTS
      await db
        .collection("packages")
        .updateOne(
          { _id: new ObjectId(packageId) },
          { $inc: { availableSlots: -numPeople } },
        );

      res.json({ message: "Booking saved & slots updated" });
    } catch (err) {
      console.error("ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ===== GET BOOKINGS =====
  router.get("/", async (req, res) => {
    try {
      const data = await db.collection("bookings").find().toArray();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching bookings" });
    }
  });

  return router;
};

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const url = process.env.MONGO_URI;

async function startServer() {
  try {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db("travelDB");

    console.log("MongoDB Connected");

    const packageRoutes = require("./routes/packages")(db);
    const bookingRoutes = require("./routes/bookings")(db);
    const userRoutes = require("./routes/users")(db);

    app.use("/packages", packageRoutes);
    app.use("/bookings", bookingRoutes);
    app.use("/users", userRoutes);

    app.get("/", (req, res) => {
      res.send("API is running");
    });

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Server error:", err);
  }
}

startServer();

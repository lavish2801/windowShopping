const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
async function main() {
  // Middleware
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // MongoDB Connection
  await mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/windowshop")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

  // Routes (to be added)
  app.use("/ping", (req, res) => {
    res.send("Welcome to the WindowShop API");
  });

  app.use("/api/admin", require("./routes/adminRoutes"));
  app.use("/api/shops", require("./routes/shopRoutes"));
  app.use("/api/customers", require("./routes/customerRoutes"));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();

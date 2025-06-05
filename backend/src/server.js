const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

async function main() {
  try {
    // Middleware
    app.use(cors({ origin: "*" }));
    
    // Increase JSON payload size limit to handle base64 images
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // MongoDB Connection
    await mongoose
      .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/windowshop")
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));

    // Initialize Sequelize
    const sequelize = require('./config/sequelize');
    const ProductImage = require('./models/ProductImage');
    
    // Test database connection
    await sequelize.authenticate()
      .then(() => console.log('Sequelize connection has been established successfully.'))
      .catch(err => console.error('Unable to connect to the database:', err));

    // Sync models
    await sequelize.sync()
      .then(() => console.log('Sequelize models synchronized'))
      .catch(err => console.error('Error synchronizing Sequelize models:', err));

    // Routes
    app.use("/ping", (req, res) => {
      res.send("Welcome to the WindowShop API");
    });

    app.use("/api/admin", require("./routes/adminRoutes"));
    app.use("/api/shops", require("./routes/shopRoutes"));
    app.use("/api/customer", require("./routes/customerRoutes"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
}

main();

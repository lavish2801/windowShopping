const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/windowshop")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Sequelize
const sequelize = require('../src/config/sequelize');
const ProductImage = require('../src/models/ProductImage');

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Sequelize connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Sync models
sequelize.sync()
  .then(() => console.log('Sequelize models synchronized'))
  .catch(err => console.error('Error synchronizing Sequelize models:', err));

// Routes
app.use("/.netlify/functions/api/ping", (req, res) => {
  res.send("Welcome to the WindowShop API");
});

app.use("/.netlify/functions/api/admin", require('../src/routes/adminRoutes'));
app.use("/.netlify/functions/api/shops", require('../src/routes/shopRoutes'));
app.use("/.netlify/functions/api/customer", require('../src/routes/customerRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the serverless handler
module.exports.handler = serverless(app); 
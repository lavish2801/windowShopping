const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  priceCode: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  images:{
    // Array of image base64 strings
    type: [String],
    default: []
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 
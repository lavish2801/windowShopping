const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  name:{
    type: String,
    required: false,
    trim: true
  },
  pin: {
    type: String,
    required: true,
    length: 4
  },
  wishlist: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
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

module.exports = mongoose.model('Customer', customerSchema); 
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  pin: {
    type: String,
    required: true,
    length: 6,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  categories: [{
    type: String,
    required: false,
    trim: true
  }],
  sizes:[
    {
      type: String,
      required: false,
      trim: true
    }
  ],
  phone: {     
    type: String,                            
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true
  },           
  pin: {
    type: String,
    required: true,
    length: 6,
    trim: true
  },
  customerUrl: {
    type: String,
    required: false,
    unique: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save middleware to auto-increment orderNumber
shopSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastShop = await this.constructor.findOne({}, {}, { sort: { 'orderNumber': -1 } });
    this.orderNumber = lastShop ? lastShop.orderNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Shop', shopSchema); 
const Customer = require("../models/Customer");
const Product = require("../models/Product");

const CustomerService = {
  login: async (mobileNumber, shopId) => {
    // Check if customer already exists
    const customerExist = await Customer.findOne({ mobileNumber, shopId });
    if (
      customerExist &&
      customerExist.createdAt &&
      new Date() - customerExist.createdAt < 24 * 60 * 60 * 1000
    ) {
      // If the customer is less than a day old, return the existing customer
      return customerExist;
    }

    const customer = new Customer({
      mobileNumber,
      pin: Math.floor(1000 + Math.random() * 9000).toString(), // Generate a random 4-digit PIN
      shopId: shopId,
    });
    await customer.save();
    return customer;
  },
  addToWishlist: async (customerId, productId) => {
    const customer = await Customer.findById(customerId);
    // add productId in wishlist
    if (!customer) {
      throw new Error("Customer not found");
    }
    const productExists = customer.wishlist.some(
      (item) => item.product.toString() === productId
    );
    if (productExists) {
      throw new Error("Product already in wishlist");
    }
    customer.wishlist.push({ product: productId });
    await customer.save();
    return customer;
  },
  getWishlist: async (customerId) => {
    const customer = await Customer.findById(customerId).populate(
      "wishlist.product"
    );
    const products = customer.wishlist.map((item) => item.product);
    return products || [];
  },
  removeFromWishlist: async (customerId, productId) => {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error("Customer not found");
    }
    // Remove product from wishlist
    customer.wishlist = customer.wishlist.filter(
      (item) => item.product.toString() !== productId
    );
    await customer.save();
    return customer;
  },
  getCustomerById: async (customerId) => {
    const customer = await Customer.findById(customerId);
    return customer;
  },
};

module.exports = CustomerService;
const CustomerService = require("../services/customerService");

const CustomerController = {
  login: async (req, res) => {
    try {
      // Find customer by mobile number and create PIN
      const customer = await CustomerService.login(
        req.query.mobileNumber,
        req.params.shopId
      );
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer Data", customer });
    } catch (error) {
      console.error("Error logging in customer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  addToWishlist: async (req, res) => {
    try {
      const { customerId } = req.params;
      const { productId } = req.body;

      const updatedCustomer = await CustomerService.addToWishlist(customerId, productId);
      res.json({ message: "Item added to wishlist", customer: updatedCustomer });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getWishlist: async (req, res) => {
    try {
      const { customerId } = req.params;
      const wishlist = await CustomerService.getWishlist(customerId);
      res.json({ message: "Wishlist retrieved", wishlist });
    } catch (error) {
      console.error("Error retrieving wishlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  removeFromWishlist: async (req, res) => {
    try {
      const { customerId, productId } = req.params;
      const updatedCustomer = await CustomerService.removeFromWishlist(customerId, productId);
      res.json({ message: "Item removed from wishlist", customer: updatedCustomer });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getCustomerById: async (req, res) => {
    try {
      const { customerId } = req.params;
      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer data retrieved", customer });
    } catch (error) {
      console.error("Error retrieving customer by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = CustomerController;

const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");

// Get customer by mobile number and PIN every time new
router.get("/:shopId/login", CustomerController.login);
// Add item to wishlist
router.post("/:customerId/wishlist", CustomerController.addToWishlist);
// Get wishlist for a customer
router.get("/:customerId/wishlist", CustomerController.getWishlist);
// Remove item from wishlist
router.delete(
  "/:customerId/wishlist/:productId",
  CustomerController.removeFromWishlist
);
router.get("/:customerId", CustomerController.getCustomerById);

module.exports = router;

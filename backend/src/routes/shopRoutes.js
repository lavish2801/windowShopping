const express = require("express");
const router = express.Router();
const ShopController = require("../controllers/ShopController");

// Route to get all shops
router.post("/login", ShopController.login);
router.post("/add-products", ShopController.addProducts);
router.post("/update-product", ShopController.updateProduct);
router.delete("/delete-product", ShopController.deleteProduct);
router.get("/get-product/:productId", ShopController.getProductById);
router.get("/:shopId/get-products", ShopController.getAllProducts);
router.get("/:shopId/get-shop-details", ShopController.getShopById);

module.exports = router;

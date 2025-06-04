const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.post('/addShop', AdminController.addShop);
router.post('/:shopId/product-category', AdminController.addProductCategory);
router.post('/:shopId/product-sizes', AdminController.addProductSizes);

module.exports = router; 
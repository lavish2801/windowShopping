const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.post('/addShop', AdminController.addShop);
router.post('/:shopId/add/product-category', AdminController.addProductCategory);
router.post('/:shopId/add/product-sizes', AdminController.addProductSizes);
router.get('/all-shops', AdminController.getAllShops);

module.exports = router; 
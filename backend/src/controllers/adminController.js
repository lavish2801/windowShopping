const AdminService = require("../services/adminService");

const AdminController = {
  addShop: async (req, res) => {
    try {
      const response = await AdminService.addShop(req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addProductCategory: async (req, res) => {
    try {
      const { category } = req.body;
      const response = await AdminService.addProductCategory(req.params.shopId, category);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addProductSizes: async (req, res) => {
    try {
      const { sizes } = req.body;
      const response = await AdminService.addProductSizes(req.params.shopId, sizes);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = AdminController;

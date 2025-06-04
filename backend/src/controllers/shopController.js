const ShopService = require("../services/shopService");
const AdmminService = require("../services/adminService");

const ShopController = {
  login: async (req, res) => {
    //name from url and pin in body
    const response = AdmminService.loginVerify(req.body);
    if (response.error) {
      return res.status(400).json({ error: response.error });
    }
    res.status(200).json({ message: "Welcome to the WindowShop API" });
  },
  addProducts: async (req, res) => {
    try {
      const { shopId, products } = req.body;
      const response = await ShopService.addProducts(shopId, products);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const { shopId } = req.params;
      const response = await ShopService.getProducts(shopId);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { shopId, productId, updatedData } = req.body;
      const response = await ShopService.updateProduct(shopId, productId, updatedData);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { shopId, productId } = req.body;
      const response = await ShopService.deleteProduct(shopId, productId);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      const response = await ShopService.getProductById(productId);
      if (!response) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getShopById: async (req, res) => {
    try {
      const { shopId } = req.params;
      const response = await ShopService.getShopById(shopId);
      if (!response) {
        return res.status(404).json({ error: "Shop not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ShopController;
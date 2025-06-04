const Shop = require("../models/Shop");
const Product = require("../models/Product");

const ShopService = {
  addProducts: async (shopId, products) => {
    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }
      /**
       * by shop._id, add products in products table
       * and add product ids in shop.products array
       */

      const productInstances = products.map((product) => {
        return new Product({
          category: product.category.toUpperCase(),
          name: product.name.toUpperCase(),
          color: product.color.toUpperCase(),
          size: product.size.toUpperCase(),
          quantity: product.quantity,
          priceCode: product.priceCode,
          availability: product.availability,
          shopId: shop._id, // Associate product with shop
        });
      });
      const savedProducts = await Product.insertMany(productInstances);
      // Update shop's products array with the new product IDs
      shop.products.push(...savedProducts.map((p) => p._id));
      await shop.save();
      return {
        message: "Products added successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getProducts: async (shopId) => {
    try {
      const products = await Product.find({ shopId });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateProduct: async (shopId, productId, updatedData) => {
    try {
      // Update product in the products array
      const updatedDataObject = {};
      if (updatedData.category) {
        updatedDataObject.category = updatedData.category;
      }
      if (updatedData.name) {
        updatedDataObject.name = updatedData.name;
      }
      if (updatedData.color) {
        updatedDataObject.color = updatedData.color;
      }
      if (updatedData.size) {
        updatedDataObject.size = updatedData.size;
      }
      if (updatedData.quantity) {
        updatedDataObject.quantity = updatedData.quantity;
      }
      if (updatedData.priceCode) {
        updatedDataObject.priceCode = updatedData.priceCode;
      }
      if (updatedData.hasOwnProperty("availability")) {
        updatedDataObject.availability = updatedData.availability;
      }

      await Product.findOneAndUpdate(
        { _id: productId, shopId },
        updatedDataObject,
        { new: true }
      );
      return {
        message: "Product updated successfully",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteProduct: async (shopId, productId) => {
    try {
      const product = await Product.findOneAndDelete({
        _id: productId,
        shopId,
      });
      if (!product) {
        throw new Error("Product not found");
      }
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }
      const productIndex = shop.products.findIndex(
        (p) => p._id.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      shop.products.splice(productIndex, 1);
      await shop.save();
      return { message: "Product deleted successfully" };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getProductById: async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },
  getShopById: async (shopId) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new Error("Shop not found");
    }
    return shop;
  },
};

module.exports = ShopService;

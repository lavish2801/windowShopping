const Shop = require("../models/Shop");
const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const { Op } = require('sequelize');

const ShopService = {
  addProducts: async (shopId, products) => {
    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }

      const savedProducts = [];
      
      for (const product of products) {
        // Process images first
        const processedImages = [];
        for (const image of product.images) {
          const savedImage = await ProductImage.create({
            image: image,
            shopId: shopId,
            type: 'base64'
          });
          processedImages.push(savedImage.id);
        }

        // Create product with processed image IDs
        const newProduct = new Product({
          category: product.category.toUpperCase(),
          name: product.name.toUpperCase(),
          color: product.color ? product.color.map(c => c.toUpperCase()) : [],
          size: product.size ? product.size.map(s => s.toUpperCase()) : [],
          quantity: product.quantity || 1,
          priceCode: product.priceCode,
          availability: product.availability !== undefined ? product.availability : true,
          images: processedImages,
          shopId: shop._id
        });

        const savedProduct = await newProduct.save();
        savedProducts.push(savedProduct);
      }

      // Update shop's products array with the new product IDs
      shop.products.push(...savedProducts.map(p => p._id));
      await shop.save();

      return {
        message: "Products added successfully",
        products: savedProducts
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getProducts: async (shopId) => {
    try {
      const products = await Product.find({ shopId });
      
      // Fetch all images for all products in one query
      const imageIds = products.reduce((ids, product) => [...ids, ...product.images], []);
      const images = await ProductImage.findAll({
        where: {
          id: {
            [Op.in]: imageIds
          }
        }
      });

      // Create a map of images for quick lookup
      const imageMap = images.reduce((map, image) => {
        map[image.id] = image.image; // Only store the image URL
        return map;
      }, {});

      // Attach image URLs to each product
      const productsWithImages = products.map(product => {
        const productObj = product.toObject();
        productObj.images = product.images.map(imageId => imageMap[imageId] || null).filter(Boolean);
        return productObj;
      });

      return productsWithImages;
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
  getShopForCustomer: async (shopUrl) => {
    const shop = await Shop.findOne({ customerUrl: `/shop/${shopUrl}` });
    if (!shop) {
      throw new Error("Shop not found");
    }
    const products = await Product.find({ shopId: shop._id });
    if (!products || products.length === 0) {
      throw new Error("No products found for this shop");
    }
    // Fetch all images for all products in one query
    const imageIds = products.reduce((ids, product) => [...ids, ...product.images], []);
    const images = await ProductImage.findAll({
      where: {
        id: {
          [Op.in]: imageIds
        }
      }
    });
    // Create a map of images for quick lookup
    const imageMap = images.reduce((map, image) => {
      map[image.id] = image.image; // Only store the image URL
      return map;
    }
    , {});
    // Attach image URLs to each product
    products.forEach(product => {
      product.images = product.images.map(imageId => imageMap[imageId] || null).filter(Boolean);
    }
    );
    if (!products || products.length === 0) {
      throw new Error("No products found for this shop");
    }
    // Return shop details and products
    return {
      shop: {
        id: shop._id,
        name: shop.name,
        email: shop.email,
        phone: shop.phone,
        customerUrl: shop.customerUrl,
        categories: shop.categories || [],
        address: shop.address,
        sizes: shop.sizes || [],
      },
      products: products.map((product) => ({
        id: product._id,
        category: product.category,
        name: product.name,
        color: product.color,
        size: product.size,
        quantity: product.quantity,
        priceCode: product.priceCode,
        availability: product.availability,
        images: product.images || [],
      })),
    };
  }
};

module.exports = ShopService;

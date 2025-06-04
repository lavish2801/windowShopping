const Shop = require('../models/Shop');

const AdminService = {
  addShop: async (data) => {
    try {
      const { name, type, address, phone, email, pin } = data;
      const urlShopName = name.toLowerCase().replace(/ /g, '-');
      const customerUrl = `https://windowshop.com/shop/${urlShopName}`; // Replace with your actual URL logic
      const shop = new Shop({ name: name.toUpperCase(), type: type.toUpperCase(), address: address.toUpperCase(), phone, email: email.toLowerCase(), pin, customerUrl });
      await shop.save();
      return shop;
    } catch (error) {
      throw new Error(error);
    }
  },
  loginVerify: async ( data) => {
    try {
      const { name, pin } = data;
      const shop = await Shop.findOne({ name: name.toUpperCase(), pin });
      if (!shop) {
        return { error: "Shop not found" };
      }
      return shop;
    } catch (error) {
      return { error: error.message };
    }
  },
  addProductCategory: async (shopId, category) => {
    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }
      if (!Array.isArray(category)) {
        category = [category];
      }
      /** make all categories uppercase */
      category = category.map((cat) => cat.toUpperCase());
      const existingCategories = shop.categories.map((cat) => cat.name);
      const newCategories = category.filter(
        (cat) => !existingCategories.includes(cat.name)
      );
      if (newCategories.length === 0) {
        return { message: "Category added successfully", category };
      }
      shop.categories.push(...newCategories);
      await shop.save();
      return { message: "Category added successfully", category };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  addProductSizes: async (shopId, sizes) => {
    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }
      if (!Array.isArray(sizes)) {
        sizes = [sizes];
      }
      /** make all sizes uppercase */
      sizes = sizes.map((size) => size.toUpperCase());
      const existingSizes = shop.sizes.map((size) => size.name);
      const newSizes = sizes.filter((size) => !existingSizes.includes(size.name));
      if (newSizes.length === 0) {
        return { message: "Sizes added successfully", sizes };
      }
      shop.sizes.push(...newSizes);
      await shop.save();
      return { message: "Sizes added successfully", sizes };
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = AdminService;

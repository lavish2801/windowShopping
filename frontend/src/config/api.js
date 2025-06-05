const BASE_URL = 'http://localhost:5000/api';

export const API = {
  // Shop related endpoints
  getShopDetails: (shopId) => `${BASE_URL}/shops/${shopId}/get-shop-details`,
  getProducts: (shopId) => `${BASE_URL}/shops/${shopId}/get-products`,
  deleteProduct: (productId) => `${BASE_URL}/shops/products/${productId}`,
  updateProduct: () => `${BASE_URL}/shops/update-product`,
  addProduct: () => `${BASE_URL}/shops/add-products`,
  getProduct: (id) => `${BASE_URL}/shops/get-product/${id}`,
  
  // Auth related endpoints
  shopLogin: () => `${BASE_URL}/shops/login`,
  
  // Customer related endpoints
  getCustomerView: (shopUrl) => `${BASE_URL}/shops/${shopUrl}/customer-view`,
  customerLogin: (shopId, mobileNumber) => `${BASE_URL}/customer/${shopId}/login?mobileNumber=${mobileNumber}`,
}; 
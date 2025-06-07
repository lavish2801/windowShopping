const BACKEND_URL =
  `${process.env.REACT_APP_BACKEND_URL}/.netlify/functions` ||
  "http://localhost:5000";

const RENDER_BACKEND_URL ='https://windowshopping-80e3.onrender.com';
const BASE_URL = `${RENDER_BACKEND_URL}/api`;
export const API = {
  // Shop related endpoints
  baseUrl: () => `${BASE_URL}`,
  getShopDetails: (shopId) => `${BASE_URL}/shops/${shopId}/get-shop-details`,
  getProducts: (shopId) => `${BASE_URL}/shops/${shopId}/get-products`,
  deleteProduct: () => `${BASE_URL}/shops/delete-product`,
  updateProduct: () => `${BASE_URL}/shops/update-product`,
  addProduct: () => `${BASE_URL}/shops/add-products`,
  getProduct: (id) => `${BASE_URL}/shops/get-product/${id}`,

  // Auth related endpoints
  shopLogin: () => `${BASE_URL}/shops/login`,

  // Customer related endpoints
  getCustomerView: (shopUrl) => `${BASE_URL}/shops/${shopUrl}/customer-view`,
  customerLogin: (shopId, mobileNumber) =>
    `${BASE_URL}/customer/${shopId}/login?mobileNumber=${mobileNumber}`,
};

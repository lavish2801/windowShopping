# WindowShop Backend API Documentation

## Overview
WindowShop is a backend API service built with Node.js, Express, and MongoDB. It provides a comprehensive platform for managing window shops, their products, and customer interactions. The system supports shop owners, customers, and administrators with specific functionalities for each role.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- CORS enabled

## API Structure

### Base URL
```
http://localhost:5000/api
```

### Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### API Endpoints

#### Shop Routes (`/api/shops`)
- `POST /login` - Shop owner login
- `POST /add-products` - Add new products to shop
- `POST /update-product` - Update existing product details
- `DELETE /delete-product` - Remove a product from shop
- `GET /get-product/:productId` - Get specific product details
- `GET /:shopId/get-products` - Get all products of a shop
- `GET /:shopId/get-shop-details` - Get shop information

#### Customer Routes (`/api/customers`)
- `GET /:shopId/login` - Customer login with mobile number and PIN
- `POST /:customerId/wishlist` - Add product to customer's wishlist
- `GET /:customerId/wishlist` - Get customer's wishlist
- `DELETE /:customerId/wishlist/:productId` - Remove product from wishlist
- `GET /:customerId` - Get customer profile details

#### Admin Routes (`/api/admin`)
- `POST /addShop` - add new shop
- `POST /:shopId/product-category` Add new categories in shop
- `POST /:shopId/product-sizes` Add product Sizes


## Data Models

### Shop
- `name` (String, required)
- `description` (String)
- `location` (String, required)
- `owner` (ObjectId, ref: 'Admin')
- `products` (Array of Product references)
- `rating` (Number)
- `isActive` (Boolean)

### Product
- `name` (String, required)
- `description` (String)
- `price` (Number, required)
- `shop` (ObjectId, ref: 'Shop')
- `category` (String)
- `stock` (Number)
- `images` (Array of Strings)

### Customer
- `username` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `fullName` (String)
- `address` (String)
- `phone` (String)
- `wishlist` (Array of Product references)

### Admin
- `username` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `role` (String, enum: ['admin'])

## Features

### Shop Management
- Shop owners can manage their product catalog
- Add, update, and delete products
- View shop statistics and details
- Manage shop profile

### Customer Features
- Secure login with mobile number and PIN
- Wishlist functionality
- View shop products
- Profile management

### Admin Features
- System administration
- Shop oversight
- User management

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/windowshop
JWT_SECRET=your_jwt_secret
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with the required variables

3. Start the server:
```bash
npm start
```

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled for all origins
- Input validation is implemented
- Rate limiting is applied to prevent abuse
- Mobile number and PIN-based authentication for customers

## Best Practices
1. Always use HTTPS in production
2. Keep JWT secret key secure
3. Implement proper error handling
4. Use environment variables for sensitive data
5. Regular security updates
6. Database indexing for better performance
7. Implement proper validation for all inputs
8. Regular backup of database
9. Monitor API usage and performance
10. Keep dependencies updated 
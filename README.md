# Window Shop Queue Management System

A web-based system for clothing shopkeepers to manage customer queues using a wishlist approach.

## Features

- Unique shop portal with QR code
- Customer registration with mobile number and 4-digit PIN
- Product catalog with wishlist functionality
- Shop admin panel for managing products
- Mobile-friendly interface

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- QR Code: qrcode npm package

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd windowshop
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/windowshop
JWT_SECRET=your_jwt_secret_key_here
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start the backend server:
```bash
cd ../backend
npm run dev
```

6. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. Shop Setup:
   - Create a new shop account
   - Get your unique QR code
   - Set up your 6-digit shop PIN

2. Customer Flow:
   - Scan shop's QR code
   - Enter mobile number
   - Receive 4-digit PIN
   - Browse products and create wishlist

3. Shop Admin:
   - Log in with shop PIN
   - Add/manage products
   - View customer wishlists

## API Endpoints

### Shop Routes
- POST `/api/shops` - Create new shop
- POST `/api/shops/login` - Shop login
- GET `/api/shops/:id` - Get shop details

### Customer Routes
- POST `/api/customers/register` - Register new customer
- POST `/api/customers/login` - Customer login
- POST `/api/customers/:customerId/wishlist` - Add to wishlist
- DELETE `/api/customers/:customerId/wishlist/:productId` - Remove from wishlist

### Product Routes
- POST `/api/products` - Add new product
- GET `/api/products/shop/:shopId` - Get shop's products
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
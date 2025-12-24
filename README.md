# Naadan Store - MERN E-commerce Platform

A complete MERN stack e-commerce application with admin panel for managing products and categories.

## Features

- 🛍️ User-facing store with product browsing
- 👨‍💼 Admin panel for managing categories and products
- 🔐 JWT authentication
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🖼️ Image upload support (Cloudinary)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account (optional, for image uploads)

## Installation

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your MongoDB connection URL
   - Update JWT secret and Cloudinary credentials (if using)

4. Create admin user:
```bash
node createAdmin.js
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Default Admin Credentials

- **Email**: admin@naadanstore.com
- **Password**: admin123

⚠️ **Important**: Change the password after first login!

## Usage

### Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Access the dashboard to manage:
   - Categories (add, edit, delete)
   - Products (add, edit, delete with multiple images)

### Customer Store

1. Navigate to `http://localhost:5173`
2. Browse products by category
3. View product details
4. Add items to cart

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Upload
- `POST /api/upload` - Upload single image (admin)
- `POST /api/upload/multiple` - Upload multiple images (admin)

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage

## Project Structure

```
naadanstore/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   │   └── admin/     # Admin panel pages
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── config/            # Configuration files
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── createAdmin.js     # Admin creation script
    ├── server.js          # Entry point
    └── package.json
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

# Food Delivery Backend - OOP Architecture

## Installation Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Step 1: Clone/Download the Project
```bash
cd food-delivery-oop
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```

Edit the `.env` file and update the following variables:
```
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_secure_random_string_here
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Linux/Mac
sudo systemctl start mongod

# For Windows (if installed as service)
net start MongoDB
```

### Step 5: Run the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:4000`

### Step 6: Test the API
Open your browser or Postman and navigate to:
```
http://localhost:4000
```

You should see: "API Working Successfully"

## API Endpoints

### User Routes (`/api/user`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /social-login` - Social login / register via Firebase (Google, Facebook)
- `GET /profile` - Get user profile (requires auth)

### Food Routes (`/api/food`)
- `POST /add` - Add food item (with image upload)
- `GET /list` - Get all food items
- `POST /remove` - Remove food item
- `PUT /update/:id` - Update food item
- `GET /search` - Search food items

### Cart Routes (`/api/cart`)
- `POST /add` - Add item to cart (requires auth)
- `POST /remove` - Remove item from cart (requires auth)
- `POST /get` - Get user cart (requires auth)
- `POST /clear` - Clear cart (requires auth)

### Order Routes (`/api/order`)
- `POST /place` - Place new order (requires auth)
- `POST /verify` - Verify payment
- `POST /userorders` - Get user orders (requires auth)
- `GET /list` - Get all orders
- `POST /status` - Update order status
- `GET /:id` - Get order by ID
- `POST /cancel` - Cancel order (requires auth)

## Project Structure
```
food-delivery-oop/
├── src/
│   ├── config/
│   │   └── Database.js
│   ├── controllers/
│   │   ├── CartController.js
│   │   ├── FoodController.js
│   │   ├── OrderController.js
│   │   └── UserController.js
│   ├── middleware/
│   │   └── AuthMiddleware.js
│   ├── models/
│   │   ├── FoodModel.js
│   │   ├── OrderModel.js
│   │   └── UserModel.js
│   ├── routes/
│   │   ├── CartRoute.js
│   │   ├── FoodRoute.js
│   │   ├── OrderRoute.js
│   │   └── UserRoute.js
│   ├── services/
│   │   └── StripeService.js
│   └── server.js
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## OOP Architecture Overview

This project uses Object-Oriented Programming principles:

- **Classes**: All controllers, models, routes, and services are implemented as classes
- **Singleton Pattern**: Models, controllers, and services are exported as singleton instances
- **Separation of Concerns**: Each class has a single responsibility
- **Encapsulation**: Private methods and properties where appropriate
- **Dependency Injection**: Services are injected into controllers

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB is accessible on the specified port

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 4000

### Stripe Errors
- Verify STRIPE_SECRET_KEY is correct
- Ensure Stripe account is properly configured

### Upload Errors
- Ensure `uploads/` directory exists
- Check write permissions on uploads directory

## Notes
- Default port: 4000
- Images are stored in `/uploads` directory
- JWT tokens expire after 7 days
- Minimum password length: 6 characters

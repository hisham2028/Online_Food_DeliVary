# 🍔 Online Food Delivery

A full-stack food delivery web application with a customer-facing storefront, an admin dashboard, and a RESTful backend API.

## Overview

| Part | Tech Stack | Port |
|------|-----------|------|
| [Frontend](./frontend/README.md) | React 19, Vite, Axios, Firebase | 5173 |
| [Backend](./backend/README.md) | Node.js, Express, MongoDB, Stripe | 4000 |
| Admin | React 18, Vite, Axios | 5174 |

## Features

### Customer App
- Browse and search food items by category
- Shopping cart with real-time totals
- User registration & login (email/password)
- Social login via Google and Facebook (Firebase)
- Place orders — Stripe payment or Cash on Delivery
- Order history & live status tracking
- Animated page transitions, fully responsive layout

### Admin Dashboard
- Add, edit, and remove food items (with image upload)
- View and manage all orders
- Update order status

### Backend API
- JWT-based authentication
- OOP architecture (controllers, services, models as classes)
- Image uploads via Cloudinary
- Stripe payment integration
- Rate limiting

## Firebase Setup (Social Login)

Social login via Google and Facebook is powered by [Firebase Authentication](https://firebase.google.com/docs/auth).  
Follow these steps to enable it for your own deployment.

### 1. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Enter a project name, accept the terms, and click **Continue** through the optional steps.
3. Once the project is created, click **Continue** to reach the project dashboard.

### 2. Register your web app

1. On the project dashboard click the **Web** icon ( `</>` ).
2. Enter an app nickname (e.g. `food-delivery`) and click **Register app**.
3. Firebase will display a `firebaseConfig` object.  Copy the values — you will need them in the next step.

### 3. Enable Authentication providers

1. In the left sidebar go to **Build → Authentication** and click **Get started**.
2. Open the **Sign-in method** tab.
3. Enable **Google** — just click the toggle, choose a project support email, and save.
4. Enable **Facebook** — you need a Facebook App ID and secret from the [Meta for Developers](https://developers.facebook.com/) portal.  Enter them and save.

### 4. Add your domain to authorised domains

1. In the **Sign-in method** tab scroll down to **Authorised domains**.
2. Add `localhost` (already there by default) and any production domain you use.

### 5. Configure the frontend environment variables

Copy the example file and fill in the values from step 2:

```bash
cp frontend/.env.example frontend/.env
```

```
VITE_FIREBASE_API_KEY=<apiKey>
VITE_FIREBASE_AUTH_DOMAIN=<authDomain>
VITE_FIREBASE_PROJECT_ID=<projectId>
VITE_FIREBASE_STORAGE_BUCKET=<storageBucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
VITE_FIREBASE_APP_ID=<appId>
```

All six values come from the `firebaseConfig` object shown when you registered the web app.

> **Note:** Firebase credentials are only required for the Google / Facebook login buttons.  
> Email/password registration and login work without them.

## Prerequisites

- **Node.js** v16+
- **MongoDB** v5+
- A **Stripe** account (for card payments)
- A **Firebase** project (for social login — optional)
- A **Cloudinary** account (for image uploads)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hisham2028/Online_Food_DeliVary.git
cd Online_Food_DeliVary
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit .env with your credentials
npm run dev
```

Key environment variables (`backend/.env`):

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `PORT` | Server port (default `4000`) |
| `FRONTEND_URL` | Customer app URL (default `http://localhost:5173`) |

### 3. Set up the Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then add Firebase credentials
npm run dev
```

### 4. Set up the Admin Panel

```bash
cd admin
npm install
npm run dev
```

The admin panel runs on `http://localhost:5174` by default.

## Project Structure

```
Online_Food_DeliVary/
├── frontend/   # Customer-facing React app
├── backend/    # Express REST API (OOP architecture)
└── admin/      # Admin React dashboard
```

## Scripts

| Directory | Command | Description |
|---|---|---|
| `backend` | `npm run dev` | Start API with auto-reload |
| `backend` | `npm start` | Start API in production mode |
| `frontend` | `npm run dev` | Start dev server |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run test` | Run unit tests |
| `admin` | `npm run dev` | Start admin dev server |
| `admin` | `npm run build` | Production build |

## API Reference

See [backend/README.md](./backend/README.md) for the full list of API endpoints.

## License

ISC

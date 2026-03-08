# Food Delivery — Customer Frontend

React-based customer-facing application for the Food Delivery platform.

## Tech Stack

- **React 19** with Vite
- **react-router-dom v7** — client-side routing
- **Axios** — HTTP requests
- **framer-motion** — page transition animations
- **react-toastify** — notifications
- **Firebase** — Google & Facebook social login
- **Vitest** + **@testing-library/react** — unit tests

## Prerequisites

- Node.js v16+
- The [backend API](../backend/README.md) running (default port `4000`)

## Setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` and fill in your Firebase credentials (required only for social login):

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | — |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | — |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | — |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | — |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | — |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | — |

## Running

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
npm run test          # Run all tests
npm run test:ui       # Open Vitest UI
```

## Features

- Browse & search food items by category
- Shopping cart with real-time totals
- User registration & login (email/password)
- Social login via Google and Facebook
- Place orders — Stripe payment or Cash on Delivery
- Order history & status tracking
- Animated page transitions
- Fully responsive layout

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable UI components
│   ├── Navbar/
│   ├── Footer/
│   ├── Login/
│   ├── FoodDisplay/
│   ├── Food Item/
│   ├── Explore-menu/
│   ├── FeaturedCategories/
│   ├── header/
│   ├── AppDownload/
│   ├── OrderConfirmation/
│   ├── BackToTop/
│   └── ScrollToTop/
├── context/         # StoreContext — global cart, food list, auth token
├── firebase/        # Firebase app & auth providers
├── pages/           # Route-level page components
│   ├── Home/
│   ├── Menu/
│   ├── Cart/
│   ├── Place Order/
│   ├── verify/
│   └── myOrders/
└── services/        # authService (social login)
```

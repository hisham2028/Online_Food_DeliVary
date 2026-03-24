import React, { useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/footer";
import Login from "./components/Login/login";
import BackToTop from './components/BackToTop/BackToTop';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Preloader from './components/Preloader/Preloader';

// Lazy-loaded page components
const Home       = lazy(() => import("./pages/Home/home"));
const Cart       = lazy(() => import("./pages/Cart/cart"));
const PlaceOrder = lazy(() => import("./pages/Place Order/placeorder"));
const Verify     = lazy(() => import("./pages/verify/verify"));
const MyOrders   = lazy(() => import("./pages/myOrders/myorders"));
const Menu       = lazy(() => import("./pages/Menu/menu"));

// Shared page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

// Fallback shown while a lazy chunk is loading
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '1.1rem',
    color: '#888',
  }}>
    Loading…
  </div>
);

const App = () => {
  const url = "https://online-food-delivary-backend2.onrender.com/";
  const url2 = "http://localhost:5000/";
  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <ToastContainer position="top-center" autoClose={3000} />

      {showLogin && <Login setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <ScrollToTop />

        {/* Suspense wraps ALL lazy routes — one boundary covers every route */}
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              <Route path="/" element={
                <PageTransition><Home /></PageTransition>
              } />

              {/* Cart & Order don't need the slide transition, but you can add it */}
              <Route path="/cart"     element={<Cart />} />
              <Route path="/order"    element={<PlaceOrder />} />

              <Route path="/verify" element={
                <PageTransition><Verify /></PageTransition>
              } />

              <Route path="/myorders" element={<MyOrders />} />

              <Route path="/menu" element={
                <PageTransition><Menu /></PageTransition>
              } />

            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>

      <Footer />
      <BackToTop />
    </>
  );
};

export default App;
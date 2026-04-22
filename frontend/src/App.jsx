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

// ── Lazy-loaded pages (each becomes its own JS chunk) ──
const Home       = lazy(() => import("./pages/Home/home"));
const Cart       = lazy(() => import("./pages/Cart/cart"));
const PlaceOrder = lazy(() => import("./pages/Place Order/placeorder"));
const Verify     = lazy(() => import("./pages/verify/verify"));
const MyOrders   = lazy(() => import("./pages/myOrders/myorders"));
const Menu       = lazy(() => import("./pages/Menu/menu"));

// ── Fade-only transition — no x-slide to prevent horizontal layout shift ──
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// ── Shown while a lazy chunk is fetching ──
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: '#888',
    fontSize: '1rem',
  }}>
    Loading…
  </div>
);

const App = () => {
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

        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              <Route path="/" element={
                <PageTransition><Home /></PageTransition>
              } />

              <Route path="/cart" element={
                <PageTransition><Cart setShowLogin={setShowLogin} /></PageTransition>
              } />

              <Route path="/order" element={
                <PageTransition><PlaceOrder setShowLogin={setShowLogin} /></PageTransition>
              } />

              <Route path="/verify" element={
                <PageTransition><Verify /></PageTransition>
              } />

              <Route path="/myorders" element={
                <PageTransition><MyOrders /></PageTransition>
              } />

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

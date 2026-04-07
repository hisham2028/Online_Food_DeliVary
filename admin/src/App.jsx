/**
 * App.jsx — Composition Root
 *
 * Design Patterns:
 *   Singleton        – ApiService.getInstance() ensures one HTTP client.
 *   Dependency Inj.  – Services created once here, injected via ServiceContext.
 *   React Context    – Replaces prop-drilling; any component calls useServices().
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ApiService      from './services/ApiService';
import FoodRepository  from './repositories/FoodRepository';
import OrderRepository from './repositories/OrderRepository';

import Navbar    from './components/navbar/Navbar';
import Sidebar   from './components/sidebar/Sidebar';
import Add       from './pages/add/Add';
import List      from './pages/list/List';
import Orders    from './pages/orders/Orders';
import Dashboard from './pages/dashboard/Dashboard';
import AdminLogin from './pages/auth/AdminLogin';
import AdminSettings from './pages/settings/AdminSettings';
import { isAdminLoggedIn, logoutAdmin } from './utils/adminAuth';

import './App.css';

// ─── Service Context (Dependency Injection) ────────────────────────────────────
export const ServiceContext = createContext(null);

export const useServices = () => {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used inside <App />');
  return ctx;
};
// ──────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'https://online-food-delivary-backend2.onrender.com';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminLoggedIn());

  const services = useMemo(() => {
    const api = ApiService.getInstance(BASE_URL);
    return {
      api,
      foodRepo:  new FoodRepository(api),
      orderRepo: new OrderRepository(api),
    };
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  return (
    <ServiceContext.Provider value={services}>
      <div className="app">
        <ToastContainer position="top-right" autoClose={3000} />
        {!isAuthenticated ? (
          <Routes>
            <Route path="*" element={<AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />} />
          </Routes>
        ) : (
          <div className="app-content-shell">
            <Navbar onLogout={handleLogout} />
            <div className="app-content">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="/"          element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add"       element={<Add />} />
                  <Route path="/list"      element={<List />} />
                  <Route path="/orders"    element={<Orders />} />
                  <Route path="/settings"  element={<AdminSettings />} />
                  <Route path="*"          element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        )}
      </div>
    </ServiceContext.Provider>
  );
};

export default App;

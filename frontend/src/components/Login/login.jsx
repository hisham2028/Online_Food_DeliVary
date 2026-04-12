// components/Login/login.jsx
import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import './login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Login = ({ setShowLogin }) => {
  const { url, setToken } = useStore();
  const navigate = useNavigate();
  
  const [currState, setCurrState] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Login Successful');
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const isBusy = isLoading || showSuccessPopup;

  const completeAuthFlow = (authToken, message) => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setSuccessMessage(message);
    setShowSuccessPopup(true);

    setTimeout(() => {
      setShowSuccessPopup(false);
      setShowLogin(false);
      navigate('/');
    }, 1200);
  };

  const handleAdminLoginRedirect = () => {
    const adminUrl = import.meta.env.VITE_ADMIN_URL || 'https://online-food-delivary.onrender.com/';
    window.location.href = adminUrl;
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        completeAuthFlow(
          response.data.token,
          currState === 'Login' ? 'Login Successful' : 'Account Created Successfully'
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const message = error?.response?.data?.message || "Something went wrong. Check your connection.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="login-popup">
      {showSuccessPopup && (
        <div className="login-success-overlay" role="status" aria-live="polite">
          <div className="login-success-box">
            <div className="success-checkmark">✓</div>
            <h3>{successMessage}</h3>
            <p>Redirecting to home...</p>
          </div>
        </div>
      )}

      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img 
            onClick={() => !isBusy && setShowLogin(false)} 
            src={assets.cross_icon} 
            alt="Close" 
            className="close-icon"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input 
              name='name' 
              onChange={onChangeHandler} 
              value={data.name} 
              type="text" 
              placeholder="Your name" 
              required 
            />
          )}
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder="Your email" 
            required 
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type="password" 
            placeholder="Password" 
            required 
          />
        </div>

        <button type="submit" className="login-btn" disabled={isBusy}>
          {isLoading ? (
            <span className="btn-loading-wrap">
              <span className="btn-spinner" aria-hidden="true" />
              Validating...
            </span>
          ) : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>

        <button
          type="button"
          className="admin-login-btn"
          onClick={handleAdminLoginRedirect}
          disabled={isBusy}
        >
          Login as Admin
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">By continuing, I agree to the terms of use & privacy policy</label>
        </div>
        <p className="toggle-auth">
          {currState === "Login" 
            ? "Create a new account? " 
            : "Already have an account? "}
          <span onClick={() => !isBusy && setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
            {currState === "Login" ? "Click here" : "Login here"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
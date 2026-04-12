import React, { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const { url } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, { email });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to send reset link.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-eyebrow">Account Recovery</p>
        <h1>Forgot Password</h1>
        <p className="auth-copy">Enter your email address and we will send you a link to reset your password.</p>

        <label htmlFor="forgot-email">Email address</label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>

        <button type="button" className="auth-link-button" onClick={() => navigate('/')}>
          Back to home
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
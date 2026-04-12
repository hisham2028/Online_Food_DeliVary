import React, { useState } from 'react';
import './auth.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { url } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = (searchParams.get('token') || '').trim();
  const emailFromQuery = (searchParams.get('email') || '').trim();
  const hasToken = token.length > 0;
  const [form, setForm] = useState({ email: emailFromQuery, password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasToken) {
      toast.error('Reset link is invalid or missing token. Please request a new one.');
      return;
    }

    if (!form.email.trim()) {
      toast.error('Email is required.');
      return;
    }

    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/reset-password`, {
        email: form.email.trim(),
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to reset password.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-eyebrow">Account Recovery</p>
        <h1>Reset Password</h1>
        <p className="auth-copy">Create a new password for your account. It must be at least 8 characters long.</p>

        {!hasToken && (
          <div className="auth-alert auth-alert-error">
            This reset link is invalid or expired. Please request a new reset link.
          </div>
        )}

        <label htmlFor="reset-email">Email address</label>
        <input
          id="reset-email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />

        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          minLength={8}
          required
          disabled={isLoading || !hasToken}
        />

        <label htmlFor="reset-confirm-password">Confirm password</label>
        <input
          id="reset-confirm-password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          minLength={8}
          required
          disabled={isLoading || !hasToken}
        />

        <button type="submit" disabled={isLoading || !token}>
          {isLoading ? 'Updating...' : 'Change password'}
        </button>

        <button type="button" className="auth-link-button" onClick={() => navigate('/forgot-password')}>
          Request a new reset link
        </button>

        <button type="button" className="auth-link-button" onClick={() => navigate('/')}>
          Back to home
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
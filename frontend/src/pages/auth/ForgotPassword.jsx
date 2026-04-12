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
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  const sendCode = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, { email: email.trim() });

      if (response.data.success) {
        toast.success(response.data.message);
        setStep('code');
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

  const verifyCode = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      toast.error('Verification code is required.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/verify-reset-code`, {
        email: email.trim(),
        code: code.trim(),
      });

      if (response.data.success) {
        toast.success('Code verified. Set your new password.');
        setStep('password');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to verify code.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/reset-password`, {
        email: email.trim(),
        code: code.trim(),
        password: newPassword,
        confirmPassword,
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
      <form
        className="auth-card"
        onSubmit={step === 'email' ? sendCode : (step === 'code' ? verifyCode : resetPassword)}
      >
        <p className="auth-eyebrow">Account Recovery</p>
        <h1>Forgot Password</h1>
        <p className="auth-copy">
          {step === 'email' && 'Enter your email and we will send a verification code.'}
          {step === 'code' && 'Enter the 6-digit verification code sent to your email.'}
          {step === 'password' && 'Set your new password below.'}
        </p>

        <label htmlFor="forgot-email">Email address</label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          disabled={isLoading || step !== 'email'}
        />

        {step !== 'email' && (
          <>
            <label htmlFor="reset-code">Verification code</label>
            <input
              id="reset-code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter 6-digit code"
              required
              disabled={isLoading || step === 'password'}
            />
          </>
        )}

        {step === 'password' && (
          <>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
              disabled={isLoading}
            />

            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              required
              disabled={isLoading}
            />
          </>
        )}

        <button type="submit" disabled={isLoading}>
          {step === 'email' && (isLoading ? 'Sending...' : 'Send code')}
          {step === 'code' && (isLoading ? 'Checking...' : 'Verify code')}
          {step === 'password' && (isLoading ? 'Updating...' : 'Reset password')}
        </button>

        {step !== 'email' && (
          <button
            type="button"
            className="auth-link-button"
            onClick={() => {
              setStep('email');
              setCode('');
              setNewPassword('');
              setConfirmPassword('');
            }}
          >
            Use another email
          </button>
        )}

        <button type="button" className="auth-link-button" onClick={() => navigate('/')}>
          Back to home
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
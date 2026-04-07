import React, { useState } from 'react';
import { loginAdmin } from '../../utils/adminAuth';
import './admin-login.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = loginAdmin(form.username, form.password);

    if (!isValid) {
      setError('Invalid admin username or password.');
      return;
    }

    setError('');
    onLoginSuccess();
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <p className="admin-login-note">Default credentials: username admin, password admin1234</p>

        <label htmlFor="admin-username">Username</label>
        <input
          id="admin-username"
          name="username"
          type="text"
          value={form.username}
          onChange={onChange}
          required
        />

        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateAdminCredentials } from '../../utils/adminAuth';
import './admin-settings.css';

const initialState = {
  currentUsername: '',
  currentPassword: '',
  newUsername: '',
  newPassword: '',
  confirmPassword: '',
};

const AdminSettings = () => {
  const [form, setForm] = useState(initialState);
  const [inlineMessage, setInlineMessage] = useState({ type: '', text: '' });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      const message = 'New password and confirm password do not match.';
      setInlineMessage({ type: 'error', text: message });
      toast.error(message);
      return;
    }

    const result = updateAdminCredentials({
      currentUsername: form.currentUsername,
      currentPassword: form.currentPassword,
      newUsername: form.newUsername,
      newPassword: form.newPassword,
    });

    if (!result.success) {
      setInlineMessage({ type: 'error', text: result.message });
      toast.error(result.message);
      return;
    }

    setInlineMessage({ type: 'success', text: result.message });
    toast.success(result.message);
    setForm(initialState);
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-card">
        <h2>Admin Credentials</h2>
        <p>Change your admin username and password.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="current-username">Current Username</label>
          <input
            id="current-username"
            name="currentUsername"
            type="text"
            value={form.currentUsername}
            onChange={onChange}
            required
          />

          <label htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            value={form.currentPassword}
            onChange={onChange}
            required
          />

          <label htmlFor="new-username">New Username</label>
          <input
            id="new-username"
            name="newUsername"
            type="text"
            value={form.newUsername}
            onChange={onChange}
            required
          />

          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={onChange}
            required
          />

          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={onChange}
            required
          />

          {inlineMessage.text && (
            <p className={`admin-settings-message ${inlineMessage.type === 'success' ? 'is-success' : 'is-error'}`}>
              {inlineMessage.text}
            </p>
          )}

          <button type="submit">Update Credentials</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;

const ADMIN_CREDENTIALS_KEY = 'admin_credentials';
const ADMIN_SESSION_KEY = 'admin_logged_in';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin1234',
};

const parseStoredCredentials = (value) => {
  try {
    const parsed = JSON.parse(value);
    if (
      parsed &&
      typeof parsed.username === 'string' &&
      typeof parsed.password === 'string' &&
      parsed.username.trim() &&
      parsed.password.trim()
    ) {
      return {
        username: parsed.username.trim(),
        password: parsed.password.trim(),
      };
    }
  } catch (error) {
    return null;
  }
  return null;
};

export const getStoredCredentials = () => {
  const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
  const parsed = parseStoredCredentials(raw);

  if (parsed) return parsed;

  localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
  return DEFAULT_CREDENTIALS;
};

export const loginAdmin = (username, password) => {
  const creds = getStoredCredentials();
  const isValid = creds.username === username.trim() && creds.password === password.trim();

  if (isValid) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  }

  return isValid;
};

export const isAdminLoggedIn = () => localStorage.getItem(ADMIN_SESSION_KEY) === 'true';

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const updateAdminCredentials = ({ currentUsername, currentPassword, newUsername, newPassword }) => {
  const creds = getStoredCredentials();

  if (creds.username !== currentUsername.trim() || creds.password !== currentPassword.trim()) {
    return { success: false, message: 'Current username or password is incorrect.' };
  }

  if (!newUsername.trim() || !newPassword.trim()) {
    return { success: false, message: 'New username and password are required.' };
  }

  if (newPassword.trim().length < 8) {
    return { success: false, message: 'New password must be at least 8 characters.' };
  }

  const nextCredentials = {
    username: newUsername.trim(),
    password: newPassword.trim(),
  };

  localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(nextCredentials));

  return { success: true, message: 'Admin credentials updated successfully.' };
};

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Login from './login';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Login Component', () => {
  const mockSetShowLogin = vi.fn();
  const mockSetToken = vi.fn();
  const mockContextValue = {
    url: 'http://localhost:4000',
    setToken: mockSetToken
  };

  const renderWithContext = () => {
    return render(
      <StoreContext.Provider value={mockContextValue}>
        <Login setShowLogin={mockSetShowLogin} />
      </StoreContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form by default', () => {
    // Arrange & Act
    renderWithContext();
    
    // Assert
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('does not show name field in login mode', () => {
    // Arrange & Act
    renderWithContext();
    
    // Assert
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument();
  });

  test('toggles to sign up mode', () => {
    // Arrange
    renderWithContext();
    
    // Act
    const toggleLink = screen.getByText('Click here');
    fireEvent.click(toggleLink);
    
    // Assert
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    // Arrange
    renderWithContext();
    
    // Act
    const emailInput = screen.getByPlaceholderText('Your email');
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    
    // Assert
    expect(emailInput.value).toBe('test@example.com');
  });

  test('submits login successfully', async () => {
    // Arrange
    axios.post.mockResolvedValue({
      data: { success: true, token: 'test-token' }
    });
    renderWithContext();
    
    // Act
    fireEvent.change(screen.getByPlaceholderText('Your email'), {
      target: { name: 'email', value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/login',
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123'
        })
      );
      expect(mockSetToken).toHaveBeenCalledWith('test-token');
      expect(mockSetShowLogin).toHaveBeenCalledWith(false);
      expect(toast.success).toHaveBeenCalledWith('Logged In Successfully');
    });
  });

  test('handles login error', async () => {
    // Arrange
    axios.post.mockResolvedValue({
      data: { success: false, message: 'Invalid credentials' }
    });
    renderWithContext();
    
    // Act
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('closes popup when close icon is clicked', () => {
    // Arrange
    renderWithContext();
    
    // Act
    const closeIcon = screen.getByAltText('Close');
    fireEvent.click(closeIcon);
    
    // Assert
    expect(mockSetShowLogin).toHaveBeenCalledWith(false);
  });

  test('requires terms checkbox to be checked', () => {
    // Arrange
    renderWithContext();
    
    // Assert
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeRequired();
  });

  test('submits signup with name field', async () => {
    // Arrange
    axios.post.mockResolvedValue({
      data: { success: true, token: 'test-token' }
    });
    renderWithContext();
    
    // Act
    fireEvent.click(screen.getByText('Click here'));
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { name: 'name', value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your email'), {
      target: { name: 'email', value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'pass123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:4000/api/user/register',
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'pass123'
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Account Created');
    });
  });

  test('handles network error', async () => {
    // Arrange
    axios.post.mockRejectedValue(new Error('Network Error'));
    renderWithContext();
    
    // Act
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Something went wrong. Check your connection.');
    });
  });
});

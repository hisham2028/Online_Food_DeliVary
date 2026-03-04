import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/Navbar/Navbar', () => ({
  default: ({ setShowLogin }) => <div data-testid="navbar">Navbar</div>
}));

vi.mock('./components/Footer/footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./components/Login/login', () => ({
  default: ({ setShowLogin }) => <div data-testid="login">Login</div>
}));

describe('App Component', () => {
  test('renders Navbar and Footer', () => {
    // Arrange & Act
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Assert
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('does not show login by default', () => {
    // Arrange & Act
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Assert
    expect(screen.queryByTestId('login')).not.toBeInTheDocument();
  });
});
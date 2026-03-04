import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Footer from './footer';

describe('Footer Component', () => {
  test('renders footer with company name', () => {
    // Arrange & Act
    render(<Footer />);
    
    // Assert
    expect(screen.getByText('Foodie Express')).toBeInTheDocument();
  });

  test('renders company description', () => {
    // Arrange & Act
    render(<Footer />);
    
    // Assert
    expect(screen.getByText(/Delicious meals delivered/i)).toBeInTheDocument();
  });

  test('renders Quick Links section', () => {
    // Arrange & Act
    render(<Footer />);
    
    // Assert
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders Contact Us section with details', () => {
    // Arrange & Act
    render(<Footer />);
    
    // Assert
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText(/info@foodieexpress.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\(123\) 456-7890/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Food Street/i)).toBeInTheDocument();
  });

  test('renders social media icons', () => {
    // Arrange & Act
    render(<Footer />);
    
    // Assert
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(3);
  });

  test('renders current year in copyright', () => {
    // Arrange
    const currentYear = new Date().getFullYear();
    
    // Act
    render(<Footer />);
    
    // Assert
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  test('scrolls to top when Home link is clicked', () => {
    // Arrange
    window.scrollTo = vi.fn();
    render(<Footer />);
    
    // Act
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    
    // Assert
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('scrolls to section when navigation link is clicked', () => {
    // Arrange
    const mockElement = { scrollIntoView: vi.fn() };
    document.getElementById = vi.fn().mockReturnValue(mockElement);
    render(<Footer />);
    
    // Act
    const menuLink = screen.getByText('Menu');
    fireEvent.click(menuLink);
    
    // Assert
    expect(document.getElementById).toHaveBeenCalledWith('explore-menu');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('has footer id for navigation', () => {
    // Arrange
    const { container } = render(<Footer />);
    
    // Assert
    const footer = container.querySelector('#footer');
    expect(footer).toBeInTheDocument();
  });
});

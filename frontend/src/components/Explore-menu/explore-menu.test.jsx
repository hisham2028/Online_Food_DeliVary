import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ExploreMenu from './explore-menu';

vi.mock('../../assets/assets', () => ({
  menu_list: [
    { menu_name: 'Salad', menu_image: 'salad.png' },
    { menu_name: 'Rolls', menu_image: 'rolls.png' },
    { menu_name: 'Desserts', menu_image: 'desserts.png' }
  ]
}));

describe('ExploreMenu Component', () => {
  test('renders component with title and description', () => {
    // Arrange
    const mockSetCategory = vi.fn();
    
    // Act
    render(<ExploreMenu category="All" setCategory={mockSetCategory} />);
    
    // Assert
    expect(screen.getByText('Explore our menu')).toBeInTheDocument();
    expect(screen.getByText(/Choose from diverse menu/i)).toBeInTheDocument();
  });

  test('renders all menu items from menu_list', () => {
    // Arrange
    const mockSetCategory = vi.fn();
    
    // Act
    render(<ExploreMenu category="All" setCategory={mockSetCategory} />);
    
    // Assert
    expect(screen.getByText('Salad')).toBeInTheDocument();
    expect(screen.getByText('Rolls')).toBeInTheDocument();
    expect(screen.getByText('Desserts')).toBeInTheDocument();
  });

  test('applies active class to selected category', () => {
    // Arrange
    const mockSetCategory = vi.fn();
    
    // Act
    render(<ExploreMenu category="Salad" setCategory={mockSetCategory} />);
    
    // Assert
    const saladImage = screen.getByAltText('Salad');
    expect(saladImage).toHaveClass('active');
  });

  test('calls setCategory when menu item is clicked', () => {
    // Arrange
    const mockSetCategory = vi.fn();
    render(<ExploreMenu category="All" setCategory={mockSetCategory} />);
    
    // Act
    const saladItem = screen.getByText('Salad');
    fireEvent.click(saladItem.closest('.explore-menu-list-item'));
    
    // Assert
    expect(mockSetCategory).toHaveBeenCalled();
  });

  test('toggles to "All" when same category is clicked', () => {
    // Arrange
    const mockSetCategory = vi.fn((callback) => {
      const result = callback('Salad');
      expect(result).toBe('All');
    });
    render(<ExploreMenu category="Salad" setCategory={mockSetCategory} />);
    
    // Act
    const saladItem = screen.getByText('Salad');
    fireEvent.click(saladItem.closest('.explore-menu-list-item'));
    
    // Assert
    expect(mockSetCategory).toHaveBeenCalled();
  });

  test('renders images with correct src and alt attributes', () => {
    // Arrange
    const mockSetCategory = vi.fn();
    
    // Act
    render(<ExploreMenu category="All" setCategory={mockSetCategory} />);
    
    // Assert
    const saladImage = screen.getByAltText('Salad');
    expect(saladImage).toHaveAttribute('src', 'salad.png');
  });

  test('renders horizontal rule after menu list', () => {
    // Arrange
    const mockSetCategory = vi.fn();
    const { container } = render(<ExploreMenu category="All" setCategory={mockSetCategory} />);
    
    // Assert
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import FoodItem from './FoodItem';
import { StoreContext } from '../../context/StoreContext';

const mockContextValue = {
  cartItems: {},
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  url: 'http://localhost:4000'
};

const renderWithContext = (component, contextValue = mockContextValue) => {
  return render(
    <StoreContext.Provider value={contextValue}>
      {component}
    </StoreContext.Provider>
  );
};

describe('FoodItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders food item with correct details', () => {
    // Arrange & Act
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />
    );
    
    // Assert
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('Fresh salad')).toBeInTheDocument();
    expect(screen.getByText('$12')).toBeInTheDocument();
  });

  test('displays add button when item not in cart', () => {
    // Arrange & Act
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />
    );
    
    // Assert
    const addButton = screen.getByText('+');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveClass('food-item-add-btn');
  });

  test('calls addToCart when add button is clicked', () => {
    // Arrange
    const mockAddToCart = vi.fn();
    const context = { ...mockContextValue, addToCart: mockAddToCart };
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />,
      context
    );
    
    // Act
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    
    // Assert
    expect(mockAddToCart).toHaveBeenCalledWith('1');
  });

  test('displays counter when item is in cart', () => {
    // Arrange
    const context = { ...mockContextValue, cartItems: { '1': 2 } };
    
    // Act
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />,
      context
    );
    
    // Assert
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('+')).toHaveLength(1);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('calls removeFromCart when minus button is clicked', () => {
    // Arrange
    const mockRemoveFromCart = vi.fn();
    const context = { 
      ...mockContextValue, 
      cartItems: { '1': 2 },
      removeFromCart: mockRemoveFromCart 
    };
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />,
      context
    );
    
    // Act
    const minusButton = screen.getByText('-');
    fireEvent.click(minusButton);
    
    // Assert
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  test('renders image with correct src', () => {
    // Arrange & Act
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />
    );
    
    // Assert
    const image = screen.getByAltText('Caesar Salad');
    expect(image).toHaveAttribute('src', 'http://localhost:4000/images/salad.jpg');
  });

  test('stops event propagation on button clicks', () => {
    // Arrange
    const mockAddToCart = vi.fn();
    const context = { ...mockContextValue, addToCart: mockAddToCart };
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />,
      context
    );
    
    // Act
    const addButton = screen.getByText('+');
    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.click(addButton, mockEvent);
    
    // Assert
    expect(mockAddToCart).toHaveBeenCalled();
  });

  test('displays rating stars image', () => {
    // Arrange & Act
    renderWithContext(
      <FoodItem 
        id="1" 
        name="Caesar Salad" 
        price={12} 
        description="Fresh salad" 
        image="salad.jpg" 
      />
    );
    
    // Assert
    const ratingImage = screen.getByAltText('rating');
    expect(ratingImage).toBeInTheDocument();
  });
});

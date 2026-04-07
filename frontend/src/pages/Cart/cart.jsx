import React, { useState } from 'react';
import './cart.css';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, token } = useStore();
  const navigate = useNavigate();
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const hasValidToken = (value) => {
    return Boolean(value && value !== 'undefined' && value !== 'null');
  };

  const removeItemCompletely = (itemId) => {
    removeFromCart(itemId, true);
  };

  const subtotal    = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total       = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    const authToken = token || localStorage.getItem('token');

    if (!hasValidToken(authToken)) {
      setCheckoutMessage('Please login to continue checkout.');
      return;
    }

    setCheckoutMessage('');
    navigate('/order');
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  {/* loading="lazy" defers off-screen images until needed */}
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={60}
                    height={60}
                  />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeItemCompletely(item._id)} className='cross'>×</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>${subtotal}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>${subtotal === 0 ? 0 : deliveryFee}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>${subtotal === 0 ? 0 : total}</b></div>
          </div>
          {checkoutMessage && <p className="cart-checkout-message">{checkoutMessage}</p>}
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


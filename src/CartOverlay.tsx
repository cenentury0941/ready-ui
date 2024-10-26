import React from 'react';
import { useCart } from './context/CartContext';
import { books } from './data/books';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✖️</button>
      <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '10px 0' }}>Cart</h2>
      <ul>
        {cartItems.map(itemId => {
          const book = books.find(book => book.id === itemId);
          return book ? (
            <li key={itemId} className="cart-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img src={book.thumbnail} alt={`${book.title} cover`} className="cart-item-thumbnail" style={{ width: '50px', height: 'auto', marginRight: '10px' }} />
              <div className="cart-item-info" style={{ flex: '1' }}>
                <h3 className="cart-item-title" style={{ fontWeight: 'bold', margin: '0' }}>{book.title}</h3>
                <p className="cart-item-author" style={{ fontSize: '0.9em', color: '#555', margin: '0' }}>{book.author}</p>
              </div>
              <button onClick={() => removeFromCart(itemId)} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
                🗑️
              </button>
            </li>
          ) : null;
        })}
      </ul>
      {cartItems.length > 0 && (
        <button
          onClick={async () => {
            try {
              const apiUrl = process.env.REACT_APP_API_URL;
              if (!apiUrl) {
                console.error('API URL is not configured');
                alert('Configuration error. Please contact support.');
                return;
              }
              const response = await fetch(`${apiUrl}/place-order`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cartItems }),
              });

              if (response.ok) {
                alert('Order placed successfully!');
                if (typeof clearCart === 'function') {
                  clearCart();
                } else {
                  console.error('clearCart function is not defined');
                }
                clearCart();
              } else {
                alert('Failed to place order. Please try again.');
              }
            } catch (error) {
              console.error('Error placing order:', error);
              // Centralized logging
              logError('Error placing order:', error);
              alert('An error occurred. Please try again.');
            }
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Place Order
        </button>
      )}
    </div>
  );
};

function logError(message: string, error: any) {
  // Implement your centralized logging mechanism here
  console.error(message, error);
}

export default CartOverlay;

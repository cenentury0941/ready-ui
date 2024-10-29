import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { books } from '../data/books';
import { Button, Card } from "@nextui-org/react";
import OrderSummary from '../OrderSummary';
import OrderConfirmation from '../OrderConfirmation';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
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
        const data = await response.json();
        setOrderId(data.orderId);
        setOrderPlaced(true);
        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <OrderConfirmation orderId={orderId} onClose={() => navigate('/dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                <Button
                  color="primary"
                  className="mt-4"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(itemId => {
                  const book = books.find(book => book.id === itemId);
                  return book ? (
                    <Card key={itemId} className="dark:bg-gray-700">
                      <div className="p-4 flex items-center">
                        <img 
                          src={book.thumbnail} 
                          alt={`${book.title} cover`} 
                          className="w-16 h-auto object-contain rounded mr-4" 
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold dark:text-gray-100">{book.title}</h4>
                          <p className="dark:text-gray-300">{book.author}</p>
                        </div>
                        <Button 
                          color="danger" 
                          onClick={() => removeFromCart(itemId)}
                          className="dark:text-red-400"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ) : null;
                })}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="w-full lg:w-1/3">
              <OrderSummary cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

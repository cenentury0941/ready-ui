import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { books } from '../data/books';
import { Button, Card } from "@nextui-org/react";
import OrderSummary from '../OrderSummary';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '../icons/TrashIcon';
import { getUserFullName, getUserId, getUserIdToken, getUserLocation } from '../utils/authUtils';
import { useMsal } from '@azure/msal-react';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const {instance} = useMsal();

  const handlePlaceOrder = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        console.error('API URL is not configured');
        alert('Configuration error. Please contact support.');
        return;
      }

      const userId = getUserId(instance);
      const userFullName = getUserFullName(instance);
      const userLocation = await getUserLocation(instance);
      const items = cartItems.map(productId => ({ productId }));
      const idToken = await getUserIdToken(instance);

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId: userId, fullName: userFullName, location: userLocation, items: items }),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        // Navigate to order confirmation page with orderId
        navigate('/order-confirmation', { 
          state: { orderId: data.responseObject.confirmationNumber }
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {cartItems.length} {cartItems.length === 1 ? 'Book' : 'Books'}
        </p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Your cart is empty</p>
                <Button
                  color="primary"
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
                    <Card 
                      key={itemId} 
                      className="border border-gray-200 dark:border-gray-700"
                      shadow="none"
                    >
                      <div className="p-4 flex items-center gap-4">
                        <img 
                          src={book.thumbnail} 
                          alt={`${book.title} cover`} 
                          className="w-20 h-[100px] object-cover rounded" 
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{book.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{book.author}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(itemId)}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        >
                          <TrashIcon size={20} />
                          <span>Remove</span>
                        </button>
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

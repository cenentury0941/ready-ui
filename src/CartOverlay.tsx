import React, { useEffect, useState } from 'react';
import './CartOverlay.css';
import { useCart } from './context/CartContext';
import { books } from './data/books';
import { getUserId, getUserFullName, getUserLocation } from './utils/authUtils';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import CartItem from './CartItem';
import OrderList from './OrderList';
import PlaceOrderButton from './PlaceOrderButton';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Order {
  confirmationNumber: string;
  books: {
    thumbnail: string;
    title: string;
    author: string;
  }[];
  status: string;
}

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          logError('API URL is not configured', new Error('Missing API URL'));
          alert('Configuration error. Please contact support.');
          return;
        }
        const userId = getUserId(instance);
        const response = await fetch(`${apiUrl}/orders?userId=${userId}`);
        if (!response.ok) {
          logError('Failed to fetch orders', new Error('Fetch error'));
          return;
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          logError('Invalid data format', new Error('Data format error'));
          return;
        }
        console.log('Fetched orders:', data);
        const ordersWithBooks = data.map((order: any) => {
          const orderBooks = order.items.map((item: any) => {
            const book = books.find((b: { id: string }) => b.id === item.productId);
            if (!book) {
              console.error(`Book with id ${item.productId} not found`);
              return null;
            }
            return book;
          }).filter((book: any) => book !== null);

          return {
            ...order,
            books: orderBooks,
          };
        });
        setOrders(ordersWithBooks);
      } catch (error) {
        logError('Error fetching orders:', error);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>✖️</button>
      <h2>Cart</h2>
      <ul>
        {cartItems.map(itemId => {
          const book = books.find((book: { id: string }) => book.id === itemId);
          if (!book) {
            console.error(`Book with id ${itemId} not found`);
            return null;
          }
          return (
            <CartItem key={itemId} book={book} onRemove={() => removeFromCart(itemId)} />
          );
        })}
      </ul>
      {cartItems.length > 0 && (
        <PlaceOrderButton cartItems={cartItems} clearCart={clearCart} />
      )}
      {orders.length > 0 && (
        <OrderList orders={orders} />
      )}
    </div>
  );
};

function logError(message: string, error: any) {
  // Example: send logs to a remote logging server
  // Implement your centralized logging mechanism here
  console.error(message, error);
}

export default CartOverlay;

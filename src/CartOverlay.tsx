import React, { useState } from 'react';
import { useCart } from './context/CartContext';
import { books } from './data/books';
import { Modal, Button, Card, ModalHeader, ModalBody, ModalContent } from "@nextui-org/react";
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';

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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

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
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        className="dark:bg-gray-800 max-w-4xl w-full"
      >
        <ModalContent>
          <OrderConfirmation orderId={orderId} onClose={onClose} />
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="dark:bg-gray-800 max-w-4xl w-full"
    >
      <ModalContent>
        <ModalHeader className="dark:text-gray-100">Your Cart</ModalHeader>
        <ModalBody>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              {cartItems.length === 0 ? (
                <p className="dark:text-gray-300">Your cart is empty.</p>
              ) : (
                cartItems.map(itemId => {
                  const book = books.find(book => book.id === itemId);
                  return book ? (
                    <Card key={itemId} className="mb-4 dark:bg-gray-700">
                      <div className="p-4 flex items-center">
                        <img src={book.thumbnail} alt={`${book.title} cover`} className="w-16 h-auto object-contain rounded mr-4" />
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
                })
              )}
            </div>
            <div className="w-full lg:w-1/3">
              <OrderSummary cartItems={cartItems} onPlaceOrder={handlePlaceOrder} />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CartOverlay;

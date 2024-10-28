import React from 'react';
import { Card, Button } from "@nextui-org/react";
import { books } from './data/books';

interface OrderSummaryProps {
  cartItems: string[];
  onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, onPlaceOrder }) => {
  const totalPrice = cartItems.reduce((total, itemId) => {
    const book = books.find(book => book.id === itemId);
    // Assuming a default price of 9.99 if not specified
    return total + (book ? (book as any).price || 9.99 : 0);
  }, 0);

  return (
    <Card>
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
        <div className="flex justify-between mb-2">
          <span>Items:</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <Button color="primary" onClick={onPlaceOrder} isDisabled={cartItems.length === 0}>
          Place Order
        </Button>
      </div>
    </Card>
  );
};

export default OrderSummary;

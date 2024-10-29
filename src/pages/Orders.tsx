import React from 'react';
import OrderList from '../OrderList';

// Temporary mock data for testing
const mockOrders = [
  {
    confirmationNumber: "ORD-001",
    books: [
      {
        thumbnail: "../assets/thinking_fast_slow.jpg",
        title: "Thinking Fast and Slow",
        author: "Daniel Kahneman"
      }
    ],
    status: "Delivered"
  },
  {
    confirmationNumber: "ORD-002",
    books: [
      {
        thumbnail: "../assets/moonshot.jpg",
        title: "Moonshot",
        author: "John Sculley"
      }
    ],
    status: "In Transit"
  }
];

const Orders: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <OrderList orders={mockOrders} />
    </div>
  );
};

export default Orders;

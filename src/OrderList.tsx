import React from 'react';
import './OrderList.css';

interface Order {
  confirmationNumber: string;
  books: {
    thumbnail: string;
    title: string;
    author: string;
  }[];
  status: string;
}

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <div className="order-list">
    <h2 className="order-list-title">Your Orders</h2>
    <ul>
      {orders.map(order => {
        return (
          <li key={order.confirmationNumber} className="order-list-item">
            <p className="order-status"><strong>Confirmation Number:</strong> {order.confirmationNumber}</p>
            {order.books.map((book, index) => (
              <div key={index} className="order-list-book-item">
                <img src={book.thumbnail} alt={`${book.title} cover`} className="order-list-book-thumbnail" />
                <div>
                  <h4 className="order-list-book-title">{book.title}</h4>
                  <p className="order-list-book-author">{book.author}</p>
                </div>
              </div>
            ))}
            <p className="order-status"><strong>Status:</strong> {order.status}</p>
          </li>
        );
      })}
    </ul>
  </div>
);

export default OrderList;

import React, { useEffect, useState } from 'react';
import { getUserId } from '../utils/authUtils';
import { books } from '../data/books';
import OrderList from '../OrderList';
import { useMsal } from '@azure/msal-react';

import { Order } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { instance } = useMsal();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          console.error('API URL is not configured');
          return;
        }
        const userId = getUserId(instance);
        if (!userId) {
          console.error('User ID is not available');
          return;
        }
        const response = await fetch(`${apiUrl}/orders/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const orderData: Order[] = data.responseObject;
          const formattedOrders = orderData.map(order => ({
            id: order.id,
            confirmationNumber: order.confirmationNumber,
            items: order.items.map(item => {
              const book = books.find(b => b.id === item.productId);
              return {
                productId: item.productId,
                thumbnail: book?.thumbnail || 'default-thumbnail.jpg',
                title: book?.title || 'Unknown Title',
                author: book?.author || 'Unknown Author',
              };
            }),
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          }));
          console.log(formattedOrders)
          setOrders(formattedOrders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen py-8">
      <OrderList orders={orders} />
    </div>
  );
};

export default Orders;

import React, { useEffect, useState } from 'react';
import { getUserId, getUserIdToken } from '../utils/authUtils';
import { books } from '../data/books';
import OrderList from '../OrderList';
import { useMsal } from '@azure/msal-react';

import { Order } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { instance } = useMsal();

  // Get unique statuses from orders
  const availableStatuses = React.useMemo(() => {
    const statuses = new Set(orders.map(order => order.status));
    return Array.from(statuses);
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const idToken = await getUserIdToken(instance);
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
        const response = await fetch(`${apiUrl}/orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });
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
            userId: order.userId || '',
            fullName: order.fullName || '',
            location: order.location || '',
          }));
          setOrders(formattedOrders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [instance]);

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    let result = [...orders];

    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, statusFilter, sortBy]);

  return (
    <div className="min-h-screen py-8">
      <OrderList 
        orders={filteredAndSortedOrders}
        statusFilter={statusFilter}
        sortBy={sortBy}
        onStatusFilterChange={setStatusFilter}
        onSortChange={setSortBy}
        availableStatuses={availableStatuses}
      />
    </div>
  );
};

export default Orders;

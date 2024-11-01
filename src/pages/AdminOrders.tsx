import React, { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { books } from '../data/books';
import OrderList from '../OrderList';
import { Order } from '../types';
import { getUserIdToken } from '../utils/authUtils';

const AdminOrders: React.FC = () => {
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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        console.error('API URL is not configured');
        return;
      }
      const idToken = await getUserIdToken(instance);
      const response = await fetch(`${apiUrl}/orders`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
          console.error('Invalid response format:', data);
          return;
        }

        const orderData: Order[] = data;
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
        const errorText = await response.text();
        console.error('Failed to fetch orders. Status:', response.status, 'Error:', errorText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        console.error('API URL is not configured');
        return;
      }

      const idToken = await getUserIdToken(instance);
      const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrders(); // Refresh the orders list
      } else {
        const errorText = await response.text();
        console.error('Failed to update order status. Status:', response.status, 'Error:', errorText);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

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
        isAdmin={true}
        onStatusUpdate={handleUpdateStatus}
      />
    </div>
  );
};

export default AdminOrders;

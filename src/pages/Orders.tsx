import React, { useEffect, useState } from 'react';
import { getUserId } from '../utils/authUtils';
import OrderList from '../OrderList';
import { useMsal } from '@azure/msal-react';

import { Order } from '../types';
import { Spinner } from '@nextui-org/react';
import axiosInstance from '../utils/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true); // Added loading state
  const { instance } = useMsal();

  // Get unique statuses from orders
  const availableStatuses = React.useMemo(() => {
    const statuses = new Set(orders.map((order) => order.status));
    return Array.from(statuses);
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const userId = getUserId(instance);
        if (!userId) {
          console.error('User ID is not available');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`orders/user/${userId}`);
        const data = response.data;

        if (data) {
          const orderData: Order[] = data.responseObject;
          const formattedOrders = orderData.map((order) => ({
            id: order.id,
            confirmationNumber: order.confirmationNumber,
            items: order.items.map((item) => ({
              productId: item.productId,
              thumbnail: item?.thumbnail || 'default-thumbnail.jpg',
              title: item?.title || 'Unknown Title',
              author: item?.author || 'Unknown Author'
            })),
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            userId: order.userId || '',
            fullName: order.fullName || '',
            location: order.location || ''
          }));
          setOrders(formattedOrders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, [instance]);

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    let result = [...orders];

    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, statusFilter, sortBy]);

  if (loading) {
    // Show spinner while loading
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='lg' color='primary' labelColor='primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8'>
      {filteredAndSortedOrders.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-600 dark:text-gray-400'>No orders found</p>
        </div>
      ) : (
        <OrderList
          orders={filteredAndSortedOrders}
          statusFilter={statusFilter}
          sortBy={sortBy}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSortBy}
          availableStatuses={availableStatuses}
        />
      )}
    </div>
  );
};

export default Orders;

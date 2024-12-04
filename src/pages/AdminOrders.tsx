import React, { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import OrderList from '../OrderList';
import { Order } from '../types';
import axiosInstance from '../utils/api';

const AdminOrders: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Get unique statuses from orders
  const availableStatuses = React.useMemo(() => {
    const statuses = new Set(orders.map((order) => order.status));
    return Array.from(statuses);
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get('orders');
      const data = response.data;

      if (data) {
        if (!data || !Array.isArray(data)) {
          console.error('Invalid response format:', data);
          return;
        }

        const orderData: Order[] = data;
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
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axiosInstance.put(`orders/${orderId}/status`, {
        status: newStatus
      });

      await fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

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

  if (isLoading) {
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
          isAdmin={true}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default AdminOrders;

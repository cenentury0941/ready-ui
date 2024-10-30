import React from 'react';
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

import { Order } from './types';

interface OrderListProps {
  orders: Order[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => (
  <div className="max-w-4xl mx-auto p-4">
    <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Order History</h2>
    <div className="space-y-6">
      {orders.map(order => (
        <Card 
          key={order.confirmationNumber} 
          className="w-full border border-gray-200 dark:border-gray-700"
          shadow="none"
        >
          <CardHeader className="flex justify-between px-6 py-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmation #:</p>
              <p className="font-semibold text-gray-900 dark:text-white">{order.confirmationNumber}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'Delivered' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {order.status}
              </span>
            </div>
          </CardHeader>
          <Divider className="bg-gray-200 dark:bg-gray-700"/>
          <CardBody className="px-6 py-4">
            <div className="space-y-4">
              {order.items.map((book, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={book.thumbnail}
                    alt={`${book.title} cover`}
                    className="w-20 h-[100px] object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">{book.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  </div>
);

export default OrderList;

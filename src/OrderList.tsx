import React from 'react';
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";

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
  <div className="max-w-[1024px] mx-auto p-4">
    <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.confirmationNumber} className="w-full">
          <CardHeader className="flex justify-between">
            <p className="text-sm">
              <span className="font-semibold">Confirmation Number:</span> {order.confirmationNumber}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Status:</span> {order.status}
            </p>
          </CardHeader>
          <Divider/>
          <CardBody>
            <div className="space-y-4">
              {order.books.map((book, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Image
                    src={book.thumbnail}
                    alt={`${book.title} cover`}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-default-500">{book.author}</p>
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

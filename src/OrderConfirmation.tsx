import React from 'react';
import { Card, Button } from "@nextui-org/react";

interface OrderConfirmationProps {
  orderId: string | null;
  onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId, onClose }) => {
  return (
    <Card>
      <div className="p-6 text-center">
        <div className="mb-4">
          <span className="text-5xl text-green-500">✔️</span>
        </div>
        <h3 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h3>
        <p className="mb-4">Confirmation #: {orderId}</p>
        <div className="flex justify-center space-x-4">
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
          <Button color="secondary" onPress={() => {/* Implement view orders functionality */}}>
            View Orders
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OrderConfirmation;

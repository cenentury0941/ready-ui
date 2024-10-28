import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartIcon: React.FC = () => {
  const { cartItems } = useCart();
  console.log('CartIcon rendered with cart items:', cartItems);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <ShoppingCartIcon className="h-6 w-6 text-white" />
      {cartItems.length > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-6px',
            background: '#ff4d4f',
            borderRadius: '50%',
            color: 'white',
            padding: '0.1em',
            fontSize: '16px',
            lineHeight: '1',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {cartItems.length}
        </span>
      )}
    </div>
  );
};

export default CartIcon;

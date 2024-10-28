import React from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import CartIcon from './CartIcon';
interface HeaderProps {
  onLogout: () => void;
  onToggleCart: () => void;
  isBooksPage: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onToggleCart, isBooksPage }) => {
  return (
    <header>
      <h1>ReadY</h1>

      <div className="header-icons">
        {isBooksPage && (
          <button onClick={onToggleCart} className="cart-icon" title="View Cart">
            <CartIcon />
          </button>
        )}
        <button onClick={onLogout} className="logout-button" title="Logout">
          <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </header>
  );
};

export default Header;

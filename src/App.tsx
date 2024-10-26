import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CartProvider } from './context/CartContext';
import CartOverlay from './CartOverlay';
import RecommendedBooks from './RecommendedBooks';

function App() {
  const [isCartOpen, setCartOpen] = React.useState(false);

  const toggleCart = () => setCartOpen(!isCartOpen);
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">ReadY</h1>
        <button className="cart-icon" onClick={toggleCart}>🛒</button>
      </header>
      <CartProvider>
        <CartOverlay isOpen={isCartOpen} onClose={toggleCart} />
        <RecommendedBooks />
      </CartProvider>
    </div>
  );
}

export default App;

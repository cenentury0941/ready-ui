import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import PrivateRoute from './components/PrivateRoute';
import Login from './Login';
import Dashboard from './Dashboard';
import { CartProvider } from './context/CartContext';
import CartOverlay from './CartOverlay';
import RecommendedBooks from './RecommendedBooks';

function App() {
  const [isCartOpen, setCartOpen] = React.useState(false);

  const toggleCart = () => setCartOpen(!isCartOpen);
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        console.log("SSO Credentials:", accounts[0]);
        const account = accounts[0];
        const idTokenClaims = account.idTokenClaims as any;
        const roles = idTokenClaims.roles || [];
        if (roles.includes("Dashboard.Write") && window.location.pathname === "/login") {
          navigate("/dashboard");
        } else if (window.location.pathname === "/login") {
          navigate("/books");
      }
    }
    }
  }, [isAuthenticated, navigate, instance]);

  const handleLogin = async () => {
    try {
      await instance.loginRedirect();
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        console.log("SSO Credentials:", accounts[0]);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">ReadY</h1>
        <button onClick={handleLogin}>Login with Microsoft</button>
        <button onClick={handleLogout}>Logout</button>
        <button className="cart-icon" onClick={toggleCart}>🛒</button>
      </header>
      <CartProvider>
        <CartOverlay isOpen={isCartOpen} onClose={toggleCart} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute roles={["Dashboard.Write"]}><Dashboard /></PrivateRoute>} />
          <Route path="/books" element={<PrivateRoute><RecommendedBooks /></PrivateRoute>} />
          <Route path="/" element={<Login />} />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Login from './Login';
import Dashboard from './Dashboard';
import { CartProvider } from './context/CartContext';
import CartOverlay from './CartOverlay';
import RecommendedBooks from './RecommendedBooks';
import Modal from './components/Modal';

function App() {
  const [isCartOpen, setCartOpen] = React.useState(false);

  const [modalMessage, setModalMessage] = React.useState<string | null>(null);
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
        const roles = idTokenClaims && idTokenClaims.roles ? idTokenClaims.roles : [];
        if (roles.includes("Dashboard.Write") && (window.location.pathname === "/login" || window.location.pathname === "/")) {
          navigate("/dashboard");
        } else if (window.location.pathname === "/login" || window.location.pathname === "/") {
          navigate("/books");
      }
    }
    }
  }, [isAuthenticated, navigate, instance]);

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect();
    } catch (error) {
      console.error("Logout failed:", error);
      setModalMessage("Logout failed. Please try again.");
    }
  };
  const isLoginPage = window.location.pathname === "/login" || window.location.pathname === "/";

  return (
    <div className="App">
      <CartProvider>
      {!isLoginPage && <Header onLogout={handleLogout} onToggleCart={toggleCart} isBooksPage={window.location.pathname === "/books"} />}
      <Modal isOpen={modalMessage !== null} message={modalMessage || ''} onClose={() => setModalMessage(null)} />
      
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

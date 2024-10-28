import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Switch, Avatar, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from "@nextui-org/react";
import { CartProvider, useCart } from './context/CartContext';
import CartOverlay from './CartOverlay';
import RecommendedBooks from './RecommendedBooks';
import Login from './components/Login';
import { CartIcon } from './icons/CartIcon';
import sharanGurunathan from './assets/sharan_gurunathan.png';

function AppContent() {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    // Set initial dark mode
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const [modalMessage, setModalMessage] = React.useState<string | null>(null);
  const toggleCart = () => setCartOpen(!isCartOpen);
  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleLogin = (username: string, password: string) => {
    // In a real application, you would validate credentials with a backend service
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('token', 'dummy-jwt-token');
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {isAuthenticated && (
        <Navbar isBordered className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <NavbarBrand>
            <p className="font-bold text-2xl text-primary-600 dark:text-primary-400">ReadY</p>
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem>
              <div className="flex items-center">
                <span className="mr-2 text-sm">
                  {isDark ? '🌙' : '☀️'}
                </span>
                <Switch
                  isSelected={isDark}
                  onValueChange={toggleDarkMode}
                  size="sm"
                  color="primary"
                  aria-label="Toggle dark mode"
                />
              </div>
            </NavbarItem>
            <NavbarItem>
              <Button
                isIconOnly
                color="primary"
                variant="light"
                onClick={toggleCart}
                aria-label="Cart"
              >
                <CartIcon />
                <CartBadge />
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    radius="sm"
                    size="sm"
                    src={sharanGurunathan}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu actions">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">Sharan Gurunathan</p>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      )}

      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? <RecommendedBooks /> : <Navigate to="/login" replace />
        } />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>

      <CartOverlay isOpen={isCartOpen} onClose={toggleCart} />
    </div>
  );
}

function CartBadge() {
  const { cartItems } = useCart();
  
  return cartItems.length > 0 ? (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
      {cartItems.length}
    </span>
  ) : null;
}

function App() {
  return (
    <NextUIProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </NextUIProvider>
  );
}

export default App;

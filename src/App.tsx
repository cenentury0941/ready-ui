import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Switch, Avatar, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from "@nextui-org/react";
import { CartProvider, useCart } from './context/CartContext';
import RecommendedBooks from './RecommendedBooks';
import Login from './components/Login';
import { CartIcon } from './icons/CartIcon';
import sharanGurunathan from './assets/sharan_gurunathan.png';
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalInstance, loginRequest } from './authConfig';
import Cart from './pages/Cart';

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set initial dark mode
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    // Initialize MSAL and handle redirects
    const initializeMsal = async () => {
      try {
        await instance.initialize();
        await instance.handleRedirectPromise();
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization error:', error);
      }
    };

    if (!isInitialized) {
      initializeMsal();
    }
  }, [instance, isInitialized]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleLogin = async () => {
    try {
      if (!isInitialized) {
        console.error('MSAL not initialized');
        return;
      }
      await instance.loginRedirect({
        ...loginRequest,
        redirectStartPage: window.location.href
      });
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = () => {
    if (!isInitialized) {
      console.error('MSAL not initialized');
      return;
    }
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-base">Authenticating...</p>
      </div>
    );
  }

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
                onClick={navigateToCart}
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
                    <p className="font-bold">{accounts[0]?.name}</p>
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
        <Route path="/cart" element={
          isAuthenticated ? <Cart /> : <Navigate to="/login" replace />
        } />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
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
    <MsalProvider instance={msalInstance}>
      <NextUIProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NextUIProvider>
    </MsalProvider>
  );
}

export default App;

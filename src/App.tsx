import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import {
  NextUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Switch,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger
} from "@nextui-org/react";
import { CartProvider, useCart } from './context/CartContext';
import RecommendedBooks from './RecommendedBooks';
import Login from './components/Login';
import { CartIcon } from './icons/CartIcon';
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { msalInstance, loginRequest } from './authConfig';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory'; // Added import for AdminInventory
import { fetchUserPhoto } from './utils/authUtils';
import BookDetails from './BookDetails';

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      const account = accounts[0];
      const idTokenClaims = account.idTokenClaims as any;
      const roles = idTokenClaims.roles || [];
      setIsAdmin(roles.includes('Admin.Write'));

      // Fetch user's photo using the utility function
      fetchUserPhoto(instance, loginRequest).then(photoUrl => {
        if (photoUrl) {
          setUserPhoto(photoUrl);
        }
      });
    }
  }, [instance, isInitialized, isAuthenticated, accounts]);

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

  const navigateToOrders = () => {
    setActiveItem("");
    setActiveItem("orders");
    navigate(isAdmin ? '/admin/orders' : '/orders');
  };

  const navigateToDashboard = () => {
    setActiveItem("");
    setActiveItem("dashboard");
    navigate('/dashboard');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white text-base">Authenticating...</p>
      </div>
    );
  }

  const menuItems = [
    {
      key: "profile",
      className: "h-14 gap-2",
      children: (
        <>
          <p className="font-medium text-x text-gray-600 dark:text-gray-400">Signed in as</p>
          <p className="font-bold">{accounts[0]?.name}</p>
        </>
      )
    },
    {
      key: "logout",
      label: "Log Out",
      color: "danger" as const,
      onClick: handleLogout
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {isAuthenticated && (
        <Navbar isBordered className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <NavbarBrand>
            <p
              className="font-bold text-2xl text-primary-600 dark:text-primary-400 cursor-pointer"
              onClick={navigateToDashboard}
            >
              ReadY
            </p>
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
            {isAdmin && (
              <NavbarItem>
                <Button
                  variant="light"
                  onClick={navigateToDashboard}
                >
                  Dashboard
                </Button>
                { activeItem === "dashboard" ? <hr className="active" /> : <></> }
              </NavbarItem>
            )}
            <NavbarItem>
              <Button
                variant="light"
                onClick={navigateToOrders}
              >
                Orders
              </Button>
              { activeItem === "orders" ? <hr className="active" /> : <></> }
            </NavbarItem>
          
            {!isAdmin && (
              <NavbarItem>
                <div className="relative">
                  <Button
                    isIconOnly
                    variant="light"
                    onClick={navigateToCart}
                    aria-label="Cart"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <CartIcon />
                  </Button>
                  <CartBadge />
                </div>
              </NavbarItem>
            )}
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    radius="sm"
                    size="sm"
                    src={userPhoto || undefined}
                    name={accounts[0]?.name?.charAt(0)}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu actions">
                  {menuItems.map(item => (
                    <DropdownItem
                      key={item.key}
                      className={item.className}
                      color={item.color}
                      onClick={item.onClick}
                    >
                      {item.children || item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      )}

      <Routes>
        <Route path="/login" element={
          isAuthenticated ?
            <Navigate to={isAdmin ? "/admin/orders" : "/dashboard"} replace />
            : <Login onLogin={handleLogin} />
        } />

        {/* Shared Route */}
        <Route path="/dashboard" element={
          isAuthenticated ? <RecommendedBooks isAdmin={isAdmin} /> : <Navigate to="/login" replace />
        } />

        {/* User Routes */}
        {!isAdmin && (
          <>
            <Route path="/cart" element={
              isAuthenticated ? <Cart /> : <Navigate to="/login" replace />
            } />
            <Route path="/orders" element={
              isAuthenticated ? <Orders /> : <Navigate to="/login" replace />
            } />
            <Route path="/order-confirmation" element={
              isAuthenticated ? <OrderConfirmation /> : <Navigate to="/login" replace />
            } />
            <Route path="/book/:id" element={
              isAuthenticated ? <BookDetails /> : <Navigate to="/login" replace />
            } />
          </>
        )}

        {/* Admin Routes */}
        {isAdmin && (
          <>
            <Route path="/admin/orders" element={
              isAuthenticated ? <AdminOrders /> : <Navigate to="/login" replace />
            } />
            <Route path="/admin/inventory" element={
              isAuthenticated ? <AdminInventory /> : <Navigate to="/login" replace />
            } />
          </>
        )}

        {/* Default Route */}
        <Route path="/" element={
          <Navigate to={
            !isAuthenticated ? "/login"
              : isAdmin ? "/admin/orders"
                : "/dashboard"
          } replace />
        } />

        {/* Catch-all route */}
        <Route path="*" element={
          <Navigate to={
            !isAuthenticated ? "/login"
              : isAdmin ? "/admin/orders"
                : "/dashboard"
          } replace />
        } />
      </Routes>
    </div>
  );
}

function CartBadge() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) return null;

  return (
    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-[#e2231a] rounded-full">
      {cartItems.length}
    </span>
  );
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

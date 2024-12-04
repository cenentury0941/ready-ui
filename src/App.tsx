import React, { useState, useEffect, useRef } from 'react';
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
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
} from '@nextui-org/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { CartProvider, useCart } from './context/CartContext';
import RecommendedBooks from './RecommendedBooks';
import Login from './components/Login';
import { CartIcon } from './icons/CartIcon';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { msalInstance, loginRequest } from './authConfig';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory'; // Added import for AdminInventory
import { fetchUserPhoto } from './utils/authUtils';
import BookDetails from './BookDetails';
import { useSetAtom } from 'jotai';
import { userPhotoAtom } from './atoms/userAtom';
import AdminApprovals from './pages/AdminApprovals';

const adminRoutes = ['/admin/orders', '/admin/inventory', '/admin/approvals'];

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  const [isInitialized, setIsInitialized] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const setUserPhotoAtom = useSetAtom(userPhotoAtom);
  const [activeItem, setActiveItem] = useState('dashboard');

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = Boolean(
    isAuthenticated &&
      accounts.length > 0 &&
      accounts?.[0]?.idTokenClaims?.roles?.includes('Admin.Write')
  );

  useEffect(() => {
    if (isAdmin && adminRoutes.some((route) => route === location.pathname)) {
      const item = location.pathname.split('/').at(-1);
      if (item) {
        setActiveItem(item);
      }
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      // Fetch user's photo using the utility function
      fetchUserPhoto(instance, loginRequest).then((photoUrl) => {
        if (photoUrl) {
          setUserPhoto(photoUrl);
          setUserPhotoAtom(photoUrl);
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
      postLogoutRedirectUri: window.location.origin
    });
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const navigateToOrders = () => {
    setActiveItem('');
    setActiveItem('orders');
    navigate(isAdmin ? '/admin/orders' : '/orders');
  };

  const navigateToDashboard = () => {
    setActiveItem('');
    setActiveItem('dashboard');
    navigate('/dashboard');
  };

  const navigateToApprovals = () => {
    setActiveItem('');
    setActiveItem('approvals');
    navigate('/admin/approvals');
  };

  if (!isInitialized) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900'>
        <p className='text-white text-base'>Authenticating...</p>
      </div>
    );
  }

  const menuItems = [
    {
      key: 'profile',
      className: 'h-14 gap-2',
      children: (
        <>
          <p className='font-medium text-x text-gray-600 dark:text-gray-400'>
            Signed in as
          </p>
          <p className='font-bold'>{accounts[0]?.name}</p>
        </>
      )
    },
    {
      key: 'logout',
      label: 'Log Out',
      color: 'danger' as const,
      onClick: handleLogout
    }
  ];

  const ProfileComponent = () => {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            isBordered
            as='button'
            radius='sm'
            size='sm'
            src={userPhoto || undefined}
            name={accounts[0]?.name?.charAt(0)}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label='User menu actions'>
          {menuItems.map((item) => (
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
    );
  };

  const CartComponent = () => {
    return (
      <div className='relative'>
        <Button
          isIconOnly
          variant='light'
          onClick={navigateToCart}
          aria-label='Cart'
          className='text-gray-700 dark:text-gray-300'
        >
          <CartIcon />
        </Button>
        <CartBadge />
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {isAuthenticated && (
        <div className='relative'>
          <Navbar
            isBordered
            className='flex bg-white/70 dark:bg-gray-900/70 backdrop-blur-md'
          >
            {/* Mobile Menu Toggle */}
            <div className={`sm:hidden -ml-3 ${!isAdmin && 'basis-1/4'}`}>
              <Button
                isIconOnly
                variant='light'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMobileMenu();
                }}
                aria-label='Toggle mobile menu'
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className='h-6 w-6' />
                ) : (
                  <Bars3Icon className='h-6 w-6' />
                )}
              </Button>
            </div>

            <div className='flex'>
              <p
                className='font-bold text-2xl text-primary-600 dark:text-primary-400 cursor-pointer'
                onClick={navigateToDashboard}
              >
                ReadY
              </p>
            </div>

            <div className='flex sm:hidden items-center gap-2'>
              {!isAdmin && <CartComponent />}
              <ProfileComponent />
            </div>

            {/* Desktop Navigation */}
            <NavbarContent
              justify='end'
              className='items-center hidden sm:flex'
            >
              <NavbarItem className='hidden sm:flex'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-center'>
                    {isDark ? '🌙' : '☀️'}
                  </span>
                  <Switch
                    isSelected={isDark}
                    onValueChange={toggleDarkMode}
                    size='sm'
                    color='primary'
                    aria-label='Toggle dark mode'
                  />
                </div>
              </NavbarItem>
              {isAdmin && (
                <>
                  <NavbarItem className='hidden sm:flex flex-col'>
                    <Button variant='light' onClick={navigateToDashboard}>
                      Dashboard
                    </Button>
                    {activeItem === 'dashboard' ? (
                      <hr className='active' />
                    ) : (
                      <></>
                    )}
                  </NavbarItem>
                  <NavbarItem>
                    <Button variant='light' onClick={navigateToApprovals}>
                      Approvals
                    </Button>
                    {activeItem === 'approvals' ? (
                      <hr className='active' />
                    ) : (
                      <></>
                    )}
                  </NavbarItem>
                </>
              )}
              <NavbarItem className='hidden sm:flex flex-col'>
                <Button variant='light' onClick={navigateToOrders}>
                  Orders
                </Button>
                {activeItem === 'orders' ? <hr className='active' /> : <></>}
              </NavbarItem>

              {!isAdmin && (
                <NavbarItem className='flex'>
                  <CartComponent />
                </NavbarItem>
              )}
              <NavbarItem>
                <ProfileComponent />
              </NavbarItem>
            </NavbarContent>
          </Navbar>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className='mobile-menu-overlay fixed inset-0 z-50 sm:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md'
            >
              <div className='flex w-full absolute justify-between items-center p-5'>
                <Button
                  isIconOnly
                  variant='light'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMobileMenu();
                  }}
                  aria-label='Toggle mobile menu'
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className='h-6 w-6' />
                  ) : (
                    <Bars3Icon className='h-6 w-6' />
                  )}
                </Button>
              </div>
              <div className='flex flex-col items-center justify-center h-full space-y-6'>
                {isAdmin && (
                  <>
                    <Button
                      color={activeItem === 'dashboard' ? 'primary' : 'default'}
                      variant='light'
                      onClick={() => {
                        navigateToDashboard();
                        toggleMobileMenu();
                      }}
                      className={`text-xl ${
                        activeItem === 'dashboard' &&
                        'underline underline-offset-8'
                      }`}
                    >
                      Dashboard
                    </Button>

                    <Button
                      color={activeItem === 'approvals' ? 'primary' : 'default'}
                      variant='light'
                      onClick={() => {
                        navigateToApprovals();
                        toggleMobileMenu();
                      }}
                      className={`text-xl ${
                        activeItem === 'approvals' &&
                        'underline underline-offset-8'
                      }`}
                    >
                      Approvals
                    </Button>
                  </>
                )}

                <Button
                  color={activeItem === 'orders' ? 'primary' : 'default'}
                  variant='light'
                  onClick={() => {
                    navigateToOrders();
                    toggleMobileMenu();
                  }}
                  className={`text-xl ${
                    activeItem === 'orders' && 'underline underline-offset-8'
                  }`}
                >
                  Orders
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Routes>
        <Route
          path='/login'
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? '/admin/orders' : '/dashboard'} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Shared Route */}
        <Route
          path='/dashboard'
          element={
            isAuthenticated ? (
              <RecommendedBooks isAdmin={isAdmin} />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />

        {/* User Routes */}
        {!isAdmin && (
          <>
            <Route
              path='/cart'
              element={
                isAuthenticated ? <Cart /> : <Navigate to='/login' replace />
              }
            />
            <Route
              path='/orders'
              element={
                isAuthenticated ? <Orders /> : <Navigate to='/login' replace />
              }
            />
            <Route
              path='/order-confirmation'
              element={
                isAuthenticated ? (
                  <OrderConfirmation />
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
            <Route
              path='/book/:id'
              element={
                isAuthenticated ? (
                  <BookDetails />
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
          </>
        )}

        {/* Admin Routes */}
        {isAdmin && (
          <>
            <Route
              path='/admin/orders'
              element={
                isAuthenticated ? (
                  <AdminOrders />
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
            <Route
              path='/admin/inventory'
              element={
                isAuthenticated ? (
                  <AdminInventory />
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
            <Route
              path='/admin/approvals'
              element={
                isAuthenticated ? (
                  <AdminApprovals />
                ) : (
                  <Navigate to='/login' replace />
                )
              }
            />
          </>
        )}

        {/* Default Route */}
        <Route
          path='/'
          element={
            <Navigate
              to={
                !isAuthenticated
                  ? '/login'
                  : isAdmin
                  ? '/admin/orders'
                  : '/dashboard'
              }
              replace
            />
          }
        />

        {/* Catch-all route */}
        <Route
          path='*'
          element={
            <Navigate
              to={
                !isAuthenticated
                  ? '/login'
                  : isAdmin
                  ? '/admin/orders'
                  : '/dashboard'
              }
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}

function CartBadge() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) return null;

  return (
    <span className='absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-[#e2231a] rounded-full'>
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

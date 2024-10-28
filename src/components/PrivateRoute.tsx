import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

interface PrivateRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles = [] }) => {
  const isAuthenticated = useIsAuthenticated();

  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();
  const userRoles = accounts.length > 0 ? (accounts[0].idTokenClaims as any).roles || [] : [];

  const hasRequiredRole = roles.length === 0 || roles.some(role => userRoles.includes(role));

  return isAuthenticated ? (hasRequiredRole ? children : <Navigate to="/login" />) : <Navigate to="/login" />;
};

export default PrivateRoute;

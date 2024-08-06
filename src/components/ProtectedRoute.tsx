// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../helpers/authHelper';

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

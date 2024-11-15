import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verificar si hay un token

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />} // Redirigir si no está autenticado
    />
  );
};

export default PrivateRoute;
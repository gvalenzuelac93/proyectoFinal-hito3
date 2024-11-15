import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, adminOnly }) => {
    const { user } = useContext(AuthContext);
    const isAuthenticated = !!localStorage.getItem('token'); // Verificar si hay un token

    console.log("Usuario autenticado:", isAuthenticated);
    console.log("Datos del usuario:", user);

    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si es una ruta admin y el usuario no es admin, redirigir a la página principal
    if (adminOnly && (!user || user.rol !== 'admin')) {
        console.log("Acceso denegado: usuario no es admin");
        return <Navigate to="/" />;
    }

    // Si está autenticado y tiene el rol adecuado, renderizar el componente
    return element;
};

export default PrivateRoute;
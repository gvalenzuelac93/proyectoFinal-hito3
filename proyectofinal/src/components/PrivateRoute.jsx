import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, adminOnly }) => {
    const { user, setUser } = useContext(AuthContext); // Asegúrate de tener setUser para actualizar el contexto
    const [loading, setLoading] = useState(true); // Para manejar la carga de datos
    const isAuthenticated = !!localStorage.getItem('token'); // Verificar si hay un token

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data); // Asegúrate de actualizar el estado del contexto
                    } else {
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                    setUser(null);
                } finally {
                    setLoading(false); // Termina la carga
                }
            };

            fetchUserData();
        } else {
            setUser(null);
            setLoading(false); // Si no hay token, termina la carga también
        }
    }, [setUser]); // Solo se ejecuta cuando el componente se monta

    // Si está cargando los datos del usuario, muestra un loader o espera
    if (loading) {
        return <div>Loading...</div>; // Puedes personalizar el loading
    }

    console.log("Usuario autenticado:", isAuthenticated);
    console.log("Datos del usuario:", user);

    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    // Si es una ruta admin y el usuario no es admin, redirigir a la página principal
    if (adminOnly && user.rol !== 'admin') {
        console.log("Acceso denegado: usuario no es admin");
        return <Navigate to="/" />;
    }

    // Si está autenticado y tiene el rol adecuado, renderizar el componente
    return element;
};

export default PrivateRoute;

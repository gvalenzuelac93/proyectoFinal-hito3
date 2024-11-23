import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, adminOnly }) => {
    const { user, setUser  } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Obtener el token del localStorage
            if (!token) {
                setLoading(false);
                return; // Si no hay token, no hacemos la solicitud
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Incluir el token en la cabecera
                    },
                });

                if (!response.ok) {
                    setError(`Error: ${response.statusText}`);
                    setUser (null);
                    return;
                }

                const data = await response.json();
                if (data) {
                    setUser (data);
                } else {
                    setError("No se encontraron datos del usuario.");
                    setUser (null);
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setError("Hubo un problema al obtener los datos.");
                setUser (null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setUser ]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <Navigate to="/login" />; // Redirigir a la página de inicio de sesión si hay un error
    }

    if (adminOnly && user?.rol !== 'admin') {
        return <Navigate to="/profile" />; // Redirigir si no es un administrador
    }

    return element; // Devolver el elemento si todo está bien
};

export default PrivateRoute;
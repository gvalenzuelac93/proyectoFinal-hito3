import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, adminOnly }) => {
    const { user, setUser  } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Datos del usuario:', data); // Verifica qué datos estás recibiendo
                if (data) {
                    setUser (data); // Asegúrate de que setUser  esté definido correctamente
                } else {
                    throw new Error("No se encontraron datos del usuario.");
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setError(error.message);
                setUser (null); // Asegúrate de que setUser  esté definido correctamente
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
        return <Navigate to="/login" />;
    }

    console.log('Usuario actual:', user); // Verifica el estado actual del usuario

    // Verifica si el usuario es un administrador
    if (adminOnly && user?.rol !== 'admin') {
        console.log('Acceso denegado: usuario no es administrador'); // Mensaje de depuración
        return <Navigate to="/profile" />;
    }

    return element; // Asegúrate de que 'element' sea un componente válido
};

export default PrivateRoute;
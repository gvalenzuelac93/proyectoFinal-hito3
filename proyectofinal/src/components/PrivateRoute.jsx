import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, adminOnly }) => {
    const { user, setUser } = useContext(AuthContext);
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
                if (data) {
                    setUser(data);
                } else {
                    throw new Error("No se encontraron datos del usuario.");
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setError(error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setUser]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.rol !== 'admin') {
        return <Navigate to="/profile" />;
    }

    return element;
};

export default PrivateRoute;
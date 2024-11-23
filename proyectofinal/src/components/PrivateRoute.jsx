import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element, adminOnly }) => {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Para manejar el error

    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        setError(`Error: ${response.statusText}`);
                        setUser(null);
                        return;
                    }

                    const data = await response.json();
                    if (data) {
                        setUser(data);
                    } else {
                        setError("No se encontraron datos del usuario.");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                    setError("Hubo un problema al obtener los datos.");
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [setUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; // Mostrar el error si lo hay
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.rol !== 'admin') {
        return <Navigate to="/" />;
    }

    return element;
};

export default PrivateRoute;

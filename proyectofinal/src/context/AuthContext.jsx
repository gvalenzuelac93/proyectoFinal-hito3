import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);

    // Función para obtener los datos del usuario desde el backend
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }

                const data = await response.json();
                setUser (data);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                setUser (null);
            }
        } else {
            setUser (null);
        }
    };

    // Cuando el componente se monta, intentamos obtener los datos del usuario
    useEffect(() => {
        fetchUserData();  // Intenta obtener los datos del usuario cuando el componente se monta
    }, []);  // Solo se ejecuta al montar el componente

    const login = (userData) => {
        setUser (userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        setUser (null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser  }}>
            {children}
        </AuthContext.Provider>
    );
};
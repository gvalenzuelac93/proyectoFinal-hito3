import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
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
                    if (!response.ok) throw new Error('Error al obtener los datos del usuario');
                    const data = await response.json();
                    setUser(data);  // Actualiza el estado con los datos del usuario
                } catch (error) {
                    console.error(error);
                    setUser(null);  // Si no se puede obtener, se pone el usuario en null
                }
            }
        };

        fetchUserData();
    }, []);  // Se ejecuta solo una vez al montar el componente

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

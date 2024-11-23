import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Verificar si el token está en localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Si hay un token, podrías obtener los datos del usuario desde el backend
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    setUser(data); // Supone que la respuesta contiene los datos del usuario
                } catch (error) {
                    console.error('Error al obtener los datos del usuario:', error);
                    setUser(null);
                }
            };

            fetchUserData();
        }
    }, []);

    const login = (userData) => {
        console.log('Datos del usuario:', userData); // Verifica los datos recibidos
        setUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

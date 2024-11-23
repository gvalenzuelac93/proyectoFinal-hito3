import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);

    const setToken = (token) => {
        localStorage.setItem('token', token);
        fetchUserData(token); // Llama a la función para obtener datos del usuario
    };

    const fetchUserData = useCallback(async (token) => {
        if (token) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser (data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                logout(); // Llama a logout si hay un error
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser (null);
    };

    const login = (userData) => {
        setUser (userData); // Actualiza el estado del usuario
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserData(token); // Llama a la función para obtener datos del usuario al montar el componente
    }, [fetchUserData]);

    return (
        <AuthContext.Provider value={{ user, setToken, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
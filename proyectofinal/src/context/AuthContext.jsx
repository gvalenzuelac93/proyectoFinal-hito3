import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const AuthContext = createContext();

// Función para verificar si el token ha expirado
const isTokenExpired = (token) => {
    if (!token) return true; // Si no hay token, se considera que está expirado
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
    return payload.exp * 1000 < Date.now(); // Verifica si la fecha de expiración es menor que la fecha actual
};

const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);

    const setToken = (token) => {
        localStorage.setItem('token', token);
    };

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');

        // Verifica si el token ha expirado
        if (isTokenExpired(token)) {
            logout(); // Cierra sesión si el token ha expirado
            return;
        }

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

    useEffect(() => {
        fetchUserData();
    }, []);

    const login = (userData) => {
        setUser (userData);
        setToken(userData.token);
    };

    const logout = () => {
        setUser (null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
import React, { createContext, useState, useEffect, useCallback } from 'react';
import jwt from 'jsonwebtoken';

export const AuthContext = createContext();


const isTokenExpired = (token) => {
    if (!token) return true; 
    try {
        const payload = jwt.decode(token); // Usamos jwt.decode en lugar de atob
        if (!payload || !payload.exp) return true; // Verificamos si hay payload y expiración
        return payload.exp * 1000 < Date.now(); 
    } catch (error) {
        console.error('Error decodificando el token:', error);
        return true; // Si hay un error, consideramos que el token es inválido
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);

    
    const setToken = (token) => {
        localStorage.setItem('token', token);
        fetchUserData(token); 
    };

    
    const fetchUserData = useCallback(async (token) => {
        
        if (isTokenExpired(token)) {
            logout(); 
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
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUser (data); 
            } catch (error) {
                console.error('Error fetching user data:', error);
                logout(); 
            }
        }
    }, []);

    
    const logout = () => {
        localStorage.removeItem('token');
        setUser (null); 
    };

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserData(token);
    }, [fetchUserData]);

    return (
        <AuthContext.Provider value={{ user, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
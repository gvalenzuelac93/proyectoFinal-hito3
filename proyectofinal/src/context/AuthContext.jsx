import React, { createContext, useState, useEffect, useCallback } from 'react';


export const AuthContext = createContext();


const isTokenExpired = (token) => {
    if (!token) return true; 
    const payload = JSON.parse(atob(token.split('.')[1])); 
    return payload.exp * 1000 < Date.now(); 
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
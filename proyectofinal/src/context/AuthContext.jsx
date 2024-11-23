import React, { createContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);

    const setToken = (token) => {
        localStorage.setItem('token', token);
        fetchUserData(token); // Cambié el nombre de la función a fetchUser Data
    };

    const fetchUserData = (token) => {
        const decoded = jwt.decode(token);
        if (decoded) {
            setUser (decoded);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser (null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token); // Cambié el nombre de la función a fetchUser Data
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
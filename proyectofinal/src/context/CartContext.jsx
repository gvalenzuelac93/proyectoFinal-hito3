import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Intenta cargar el carrito desde localStorage
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : []; // Si hay un carrito guardado, lo parsea, de lo contrario, inicia como un array vacío
    });

    useEffect(() => {
        // Almacena el carrito en localStorage cada vez que cambie
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + product.cantidad } : item
                );
            }
            return [...prevCart, product]; // Asegúrate de que 'product' contenga la imagen
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (id, cantidad) => {
        setCart((prevCart) => 
            prevCart.map(item => 
                item.id === id ? { ...item, cantidad } : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
      setCart((prevCart) => {
          const existingProduct = prevCart.find(item => item.id === product.id);
          if (existingProduct) {
              return prevCart.map(item =>
                  item.id === product.id ? { ...item, cantidad: item.cantidad + product.cantidad } : item
              );
          }
          return [...prevCart, product];
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
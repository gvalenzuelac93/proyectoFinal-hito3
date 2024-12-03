import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const calculateTotal = () => {
            const total = cart.reduce((acc, item) => {
                return acc + (item.precio * item.cantidad);
            }, 0);
            setTotalPrice(total);
        };

        calculateTotal();
    }, [cart]);

    const handleCreateOrder = async () => {
        if (!user) {
            setNotification('Debes iniciar sesión para crear una orden.');
            return;
        }

        if (cart.length === 0) {
            setNotification('No puedes crear una orden con un carrito vacío.');
            return;
        }

        try {
            const response = await fetch('/api/ordenes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Agrega el token de autenticación si es necesario
                },
                body: JSON.stringify({
                    items: cart,
                    total: totalPrice,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la orden');
            }

            setNotification('Orden creada exitosamente.');
            // Aquí puedes redirigir o limpiar el carrito si es necesario
        } catch (error) {
            console.error('Error creando la orden:', error);
            setNotification('Error al crear la orden. Intenta nuevamente.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Carrito de Compras</h2>
            {notification && <div className="alert alert-info">{notification}</div>}
            {cart.length === 0 ? (
                <div className="alert alert-info">Tu carrito está vacío</div>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.id} className="card mb-3">
                            <div className="card-body d-flex align-items-center">
                                <img 
                                    src={item.imagen || 'ruta/a/imagen/predeterminada.jpg'} 
                                    alt={item.titulo} 
                                    style={{ width: '100px', height: '100px', marginRight: '10px' }}
                                />
                                <div className="flex-grow-1">
                                    <h5 className="card-title">{item.titulo}</h5>
                                    <p className="card-text">Precio: ${Number(item.precio).toFixed(2)}</p>
                                    <div className="d-flex align-items-center">
                                        <span>Cantidad: {item.cantidad}</span>
                                        <button className="btn btn-danger mt-2 ms-2" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Total: ${totalPrice.toFixed(2)}</h5>
                            <button onClick={handleCreateOrder} className="btn btn-primary">
                                Crear Orden
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
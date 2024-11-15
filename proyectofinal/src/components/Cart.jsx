import React, { useContext, useMemo, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    useEffect(() => {
      const calculateTotal = () => {
          const total = cart.reduce((acc, item) => {
              return acc + (item.precio * item.cantidad); // Multiplica el precio por la cantidad
          }, 0);
          setTotalPrice(total);
      };
  
      calculateTotal();
  }, [cart]);

    const handleProceedToCheckout = async () => {
        if (!user) {
            alert('Por favor, inicia sesión para continuar con la compra');
            navigate('/login');
        } else {
            setIsProcessingOrder(true);
            const orderData = {
                items: cart,
                total: totalPrice,
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/ordenes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) throw new Error('Error al procesar la orden');

                const order = await response.json();
                alert(`Orden procesada exitosamente. ID: ${order.id}`);
                clearCart(); // Limpiar el carrito después de la compra
                navigate('/orders'); // Redirigir a la página de órdenes
            } catch (error) {
                alert(error.message);
            } finally {
                setIsProcessingOrder(false);
            }
        }
    };

    // Funciones para aumentar y disminuir la cantidad
    const increaseQuantity = (id) => {
        const item = cart.find(item => item.id === id);
        if (item) {
            updateQuantity(id, item.cantidad + 1);
        }
    };

    const decreaseQuantity = (id) => {
        const item = cart.find(item => item.id === id);
        if (item && item.cantidad > 1) {
            updateQuantity(id, item.cantidad - 1);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Carrito de Compras</h2>
            {cart.length === 0 ? (
                <div className="alert alert-info">
                    Tu carrito está vacío
                </div>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{item.titulo}</h5>
                                <p className="card-text">Precio: ${Number(item.precio).toFixed(2)}</p>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-secondary me-2" onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span>{item.cantidad}</span>
                                    <button className="btn btn-secondary ms-2" onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>
                                <button className="btn btn-danger mt-2" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Total: ${totalPrice.toFixed(2)}</h5>
                            <button className="btn btn-primary" onClick={handleProceedToCheckout} disabled={isProcessingOrder}>
                                {isProcessingOrder ? 'Procesando...' : 'Proceder al Pago'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const calculateTotal = () => {
            const total = cart.reduce((acc, item) => {
                return acc + (item.precio * item.cantidad);
            }, 0);
            setTotalPrice(total);
        };

        calculateTotal();
    }, [cart]);

    console.log("Contenido del carrito:", cart); // Verifica el contenido del carrito

    return (
        <div className="container mt-4">
            <h2>Carrito de Compras</h2>
            {cart.length === 0 ? (
                <div className="alert alert-info">
                    Tu carrito está vacío
                </div>
            ) : (
                <>
                    {cart.map((item) => {
                        const imagenUrl = item.imagen || 'ruta/a/imagen/predeterminada.jpg'; // Usa la imagen que se guardó en el carrito
                        console.log("Imagen URL:", imagenUrl); // Verifica la URL de la imagen
                        return (
                            <div key={item.id} className="card mb-3">
                                <div className="card-body d-flex align-items-center">
                                    <img 
                                        src={imagenUrl} 
                                        alt={item.titulo} 
                                        style={{ width: '100px', height: '100px', marginRight: '10px' }} // Ajusta el tamaño según sea necesario
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
                        );
                    })}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Total: ${totalPrice.toFixed(2)}</h5>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
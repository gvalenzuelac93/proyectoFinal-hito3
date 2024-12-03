import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);  // Obtenemos los datos del usuario
  const [activeTab, setActiveTab] = useState('profile');
  const [orderHistory, setOrderHistory] = useState([]);

  const fetchOrderHistory = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ordenes/usuario`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener el historial de pedidos: ' + response.statusText);
        }

        const data = await response.json();
        setOrderHistory(data);
    } catch (error) {
        console.error(error);
        setNotification(error.message); // Mostrar el error al usuario
    }
};

  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    }
  }, [user]);

  const renderOrderHistory = () => {
    return (
      <div>
        <h3>Historial de Pedidos</h3>
        {orderHistory.length === 0 ? (
          <p>No tienes pedidos anteriores.</p>
        ) : (
          <ul>
            {orderHistory.map(order => (
              <li key={order.id}>
                <p>ID de Orden: {order.id}</p>
                <p>Total: ${order.total}</p>
                <h4>Productos:</h4>
                {Array.isArray(order.productos) && order.productos.length > 0 ? (
                  <ul>
                    {order.productos.map(product => (
                      <li key={product.producto_id}>
                        <p>Producto: {product.titulo}</p>
                        <p>Cantidad: {product.cantidad}</p>
                        <p>Precio: ${product.precio}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay productos en esta orden.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    if (!user) {
      return <p>Cargando...</p>;
    }

    return (
      <div>
        <h3>Información del Perfil</h3>
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h3>Perfil de Usuario</h3>
      <div className="tabs">
        <button onClick={() => setActiveTab('profile')}>Perfil</button>
        <button onClick={() => setActiveTab('orders')}>Historial de Pedidos</button>
      </div>
      {activeTab === 'profile' ? renderProfile() : renderOrderHistory()}
    </div>
  );
};

export default Profile;
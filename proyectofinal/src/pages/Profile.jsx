import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);  // Obtenemos los datos del usuario
  const [activeTab, setActiveTab] = useState('profile');
  const [orderHistory, setOrderHistory] = useState([]);

  // Método para obtener el historial de pedidos
  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ordenes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener el historial de pedidos');

      const data = await response.json();
      setOrderHistory(data); // Asumiendo que la respuesta es un array de pedidos
    } catch (error) {
      console.error(error);
    }
  };

  // Llama a fetchOrderHistory cuando el componente se monta y el usuario está disponible
  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    }
  }, [user]);  // Dependemos del 'user' para recargar los datos

  // Método para renderizar el historial de pedidos
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
                      <li key={product.producto_id}> {/* Asegúrate de usar la propiedad correcta */}
                        <p>Producto: {product.titulo}</p> {/* Aquí se muestra el nombre del producto */}
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

  // Método para renderizar la información del perfil
  const renderProfile = () => {
    if (!user) {
      return <p>Cargando...</p>;  // Puedes mostrar un mensaje de carga mientras el usuario está siendo cargado
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
      <h2>Perfil de Usuario</h2>
      <div className="nav nav-tabs" role="tablist">
        <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Perfil</button>
        <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Historial de Pedidos</button>
      </div>
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'orders' && renderOrderHistory()}
    </div>
  );
};

export default Profile;

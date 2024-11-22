import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchData } from "../services/api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [orderHistory, setOrderHistory] = useState([]);

  // Método para obtener el historial de pedidos
  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetchData('api/ordenes', {
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

  // Llama a fetchOrderHistory cuando el componente se monta
  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    }
  }, [user]);

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
    return (
      <div>
        <h3>Información del Perfil</h3>
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Aquí puedes agregar campos para editar la información del perfil */}
      </div>
    );
  };

  // Método para renderizar el cambio de contraseña
  // const renderChangePassword = () => {
  //   return (
  //     <div>
  //       <h3>Cambiar Contraseña</h3>
  //       {/* Aquí puedes agregar un formulario para cambiar la contraseña */}
  //     </div>
  //   );
  // };

  return (
    <div className="container mt-4">
      <h2>Perfil de Usuario</h2>
      <div className="nav nav-tabs" role="tablist">
        <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Perfil</button>
        <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Historial de Pedidos</button>
         {/* <button className={`nav-link ${activeTab === 'changePassword' ? 'active' : ''}`} onClick={() => setActiveTab('changePassword')}>Cambiar Contraseña</button> */}
      </div>
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'orders' && renderOrderHistory()}
      {/* {activeTab === 'changePassword' && renderChangePassword()} */}
    </div>
  );
};

export default Profile;
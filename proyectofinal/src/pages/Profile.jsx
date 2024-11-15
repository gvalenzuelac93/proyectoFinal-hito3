import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser  } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editedUser , setEditedUser ] = useState({ ...user });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Lógica para actualizar el usuario...
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Lógica para cambiar la contraseña...
  };

  const renderProfile = () => {
    return (
      <div>
        <h3>Información del Perfil</h3>
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editedUser .nombre || ''}
            onChange={(e) => setEditedUser ({ ...editedUser , nombre: e.target.value })}
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            value={editedUser .email || ''}
            onChange={(e) => setEditedUser ({ ...editedUser , email: e.target.value })}
            placeholder="Correo electrónico"
            required
          />
          <button type="submit">Actualizar</button>
        </form>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>
    );
  };

  const renderOrderHistory = () => {
    // Lógica para renderizar el historial de pedidos...
    return <div>Historial de Pedidos</div>;
  };

  const renderChangePassword = () => {
    return (
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
          required
        />
        <button type="submit">Cambiar Contraseña</button>
      </form>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Perfil de Usuario</h2>
      <div className="nav nav-tabs" role="tablist">
        <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Perfil</button>
        <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Historial de Pedidos</button>
        <button className={`nav-link ${activeTab === 'changePassword' ? 'active' : ''}`} onClick={() => setActiveTab('changePassword')}>Cambiar Contraseña</button>
      </div>
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'orders' && renderOrderHistory()}
      {activeTab === 'changePassword' && renderChangePassword()}
    </div>
  );
};

export default Profile;
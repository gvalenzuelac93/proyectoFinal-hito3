import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext); // Obtener la función login desde el AuthContext
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
  });
  const [error, setError] = useState(null); // Para manejar los errores
  const navigate = useNavigate();

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    try {
      // Realiza la solicitud de inicio de sesión al backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          contraseña: formData.contraseña,
        }),
      });

      // Obtiene la respuesta en formato JSON
      const data = await response.json();

      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }

      // Almacena el token en el localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Verifica que el usuario tenga el rol
      if (!data.user || !data.user.rol) {
        throw new Error('Usuario no encontrado o sin rol');
      }

      // Llama a la función login del AuthContext para actualizar el estado global
      login(data.user);

      // Redirige al usuario según su rol
      if (data.user.rol === 'admin') {
        navigate('/admin'); // Redirigir al panel de administración
      } else {
        navigate('/profile'); // Redirigir al perfil del usuario
      }
    } catch (error) {
      setError(error.message); // Muestra el error si ocurre
    }
  };

  return (
    <div className="container mt-4">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="contraseña"
            className="form-control"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
        </div>

        {/* Muestra el error si hay uno */}
        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary mt-3">
          Iniciar Sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          type="button"
          className="btn btn-secondary mt-3 ms-2"
        >
          Registrar Usuario
        </button>
      </form>
    </div>
  );
};

export default Login;

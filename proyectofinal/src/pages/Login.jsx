import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext); // Obtener la función login desde el AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);  // Limpiar errores previos

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login fallido. Verifica tus credenciales.');
      }

      const userData = await response.json();
      login(userData); // Llama a la función login que actualiza el contexto
      navigate('/profile');  // Redirige al perfil del usuario después de iniciar sesión
    } catch (error) {
      setError(error.message);  // Muestra el error si la autenticación falla
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Introduce tu correo electrónico"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce tu contraseña"
            required
          />
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}  {/* Muestra un mensaje de error si lo hay */}
        <button type="submit" className="btn btn-primary">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;

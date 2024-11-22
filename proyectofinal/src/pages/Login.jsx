import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchData } from "../services/api";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
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

        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }


        if (!response.ok) {
            throw new Error(data.error || 'Error en el inicio de sesión');
        }

        // Verifica que el rol esté presente en la respuesta
        if (!data.user || !data.user.rol) {
            throw new Error('Usuario no encontrado o sin rol');
        }


        alert('Inicio de sesión exitoso');

        // Redirigir según el rol del usuario
        if (data.user.rol === 'admin') {
            navigate('/admin'); // Redirigir al panel de administración
        } else {
            navigate('/profile'); // Redirigir a la página de perfil del usuario
        }
    } catch (error) {
        alert(error.message);
    }
};
  return (
    <div className="container mt-4">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          name="email" 
          className="form-control" 
          placeholder="Correo electrónico" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="contraseña" 
          className="form-control mt-2" 
          placeholder="Contraseña" 
          value={formData.contraseña} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" className="btn botonlogin mt-3">Iniciar Sesión</button>
        <button onClick={() => navigate('/register')} type="button" className="btn botonlogin mt-3">Registrar Usuario</button>
      </form>
    </div>
  );
};

export default Login;
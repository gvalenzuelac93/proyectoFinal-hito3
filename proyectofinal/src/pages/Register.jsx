import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '', // Agregar el campo nombre
    email: '',
    contraseña: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre, // Asegúrate de incluir el nombre
          email: formData.email,
          contraseña: formData.contraseña,
        }),
      });

      if (!response.ok) throw new Error('Error en el registro');

      const data = await response.json();
      alert('Registro exitoso');
      navigate('/login'); // Redirigir a la página de inicio de sesión
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn mi-botonsito mt-3">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, setToken } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        contraseña: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

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

            if (!response.ok) {
                throw new Error(data.error || 'Error en el inicio de sesión');
            }

            if (data.token) {
                setToken(data.token); // Almacena el token
            }

            if (data.user) {
                login(data.user); // Actualiza el estado del usuario
                console.log('Usuario logueado:', data.user); // Verifica que el usuario se esté estableciendo correctamente

                // Redirige según el rol del usuario
                if (data.user.rol === 'admin') {
                    navigate('/admin'); 
                } else {
                    navigate('/profile'); 
                }
            } else {
                throw new Error('No se recibió información del usuario');
            }
        } catch (error) {
            setError(error.message);
            console.error('Error al iniciar sesión:', error); // Para depuración
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

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn mi-botonsito mt-3">Iniciar Sesión</button>
                <button type="submit" className="btn mi-botonsito mt-3">Registrar</button>
            </form>
        </div>
    );
};

export default Login;
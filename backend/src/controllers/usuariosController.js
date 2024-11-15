const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    const { nombre, email, contraseña, rol } = req.body; // Asegúrate de que el rol esté en la solicitud

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const newUser   = await pool.query(
            'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, hashedPassword, rol || 'user'] // Asigna 'user' si no se proporciona rol
        );
        res.status(201).json(newUser .rows[0]);
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ error: 'Error registrando usuario' });
    }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(contraseña, user.rows[0].contraseña);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Asegúrate de que el rol esté incluido aquí
        const { id, nombre, rol } = user.rows[0]; // Asegúrate de que el rol esté disponible
        res.json({ user: { id, nombre, role: rol } }); // Envolver en un objeto user
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error iniciando sesión' });
    }
};

// Obtener todos los usuarios (solo para admin)
const obtenerUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ error: 'Error obteniendo usuarios' });
    }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    if (!nombre || !email || !rol) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, email = $2, rol = $3 WHERE id = $4 RETURNING *',
            [nombre, email, rol, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error actualizando usuario' });
    }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
};
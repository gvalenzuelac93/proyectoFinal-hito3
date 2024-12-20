const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode'); // Asegúrate de instalar esta dependencia

// Registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const newUser = await pool.query(
            'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, hashedPassword, rol || 'user']
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ error: 'Error registrando usuario' });
    }
};

// Iniciar sesión
const loginUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    console.log('Cuerpo de la solicitud:', req.body);

    if (!email || !contraseña) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    try {
        // Consulta a la base de datos para obtener al usuario
        const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparación de contraseñas (contraseña del cliente contra contrasena de la base de datos)
        const validPassword = await bcrypt.compare(contraseña, user.rows[0].contrasena);

        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const { id, nombre, rol } = user.rows[0];

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no está definido');
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        // Generar el token
        const token = jwt.sign({ id, nombre, rol, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token como cookie
        res.cookie('token', token, {
            httpOnly: true, // No accesible desde JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            maxAge: 3600000, // 1 hora
        });

        // Responder con el token y los datos del usuario
        res.json({ token, user: { id, nombre, rol, email } });

    } catch (error) {
        console.error('Error al iniciar sesión:', error.stack || error.message || error);
        res.status(500).json({ error: 'Error iniciando sesión' });
    }
};

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token desde el encabezado Authorization
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded; // Guardar la información del usuario decodificada en la solicitud
        next();
    });
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

const obtenerUsuario = async (req, res) => {
    const { id } = req.user;  // Extraer el id del usuario desde el token
  
    try {
        const result = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = $1', [id]);
  
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        res.json(result.rows[0]);
    } catch (error 
) {
        console.error('Error obteniendo usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
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
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    verificarToken,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario,
};

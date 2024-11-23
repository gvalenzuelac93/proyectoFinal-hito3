const express = require('express');
const auth = require('../middleware/auth'); // Asegúrate de importar el middleware de autenticación
const {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuario
} = require('../controllers/usuariosController');
const { verificarToken } = require('../controllers/usuariosController');
const router = express.Router();

// Rutas de usuarios
router.post('/registrar', registrarUsuario); // Ruta pública
router.post('/login', loginUsuario); // Ruta pública
router.get('/', obtenerUsuarios); // Ruta protegida (solo para usuarios autenticados)
router.put('/:id', actualizarUsuario); // Ruta protegida (solo para usuarios autenticados)
router.delete('/:id', eliminarUsuario); // Ruta protegida (solo para usuarios autenticados)
// Ruta protegida para obtener los datos del usuario
router.get('/me', obtenerUsuario);  // Usamos el middleware de verificación de token

module.exports = router;
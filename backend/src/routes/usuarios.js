const express = require('express');
const auth = require('../middleware/auth'); // Asegúrate de importar el middleware de autenticación
const {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuariosController');

const router = express.Router();

// Rutas de usuarios
router.post('/registrar', registrarUsuario); // Ruta pública
router.post('/login', loginUsuario); // Ruta pública
router.get('/', auth, obtenerUsuarios); // Ruta protegida (solo para usuarios autenticados)
router.put('/:id', auth, actualizarUsuario); // Ruta protegida (solo para usuarios autenticados)
router.delete('/:id', auth, eliminarUsuario); // Ruta protegida (solo para usuarios autenticados)

module.exports = router;
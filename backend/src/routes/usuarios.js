const express = require('express');
const auth = require('../middleware/auth');
const {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuario
} = require('../controllers/usuariosController');

const router = express.Router();

// Rutas de usuarios
router.post('/registrar', registrarUsuario); // Ruta pública
router.post('/login', loginUsuario); // Ruta pública
router.get('/', auth, obtenerUsuarios); // Ruta protegida
router.put('/:id', auth, actualizarUsuario); // Ruta protegida
router.delete('/:id', auth, eliminarUsuario); // Ruta protegida
router.get('/me', auth, obtenerUsuario);  // Ruta protegida

module.exports = router;
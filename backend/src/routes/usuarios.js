const express = require('express');
const {
    registrarUsuario,
    loginUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuariosController');

const router = express.Router();

// Rutas de usuarios
router.post('/registrar', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', obtenerUsuarios);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
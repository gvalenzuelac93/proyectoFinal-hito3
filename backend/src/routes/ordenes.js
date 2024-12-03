const express = require('express');
const { crearOrden, obtenerOrdenes, obtenerOrdenPorId, obtenerOrdenesDelUsuario } = require('../controllers/ordenesController');
const verificarToken = require('../middleware/auth');
const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', verificarToken, crearOrden); // Asegúrate de que la ruta esté protegida

// Ruta para obtener todas las órdenes
router.get('/', obtenerOrdenes);

router.get('/ordenes/usuario', verificarToken, obtenerOrdenesDelUsuario);


// Ruta para obtener una orden específica por ID
router.get('/:id', obtenerOrdenPorId);

module.exports = router;
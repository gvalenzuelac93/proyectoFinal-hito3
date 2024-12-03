const express = require('express');
const { crearOrden, obtenerOrdenes, obtenerOrdenPorId, obtenerOrdenesDelUsuario } = require('../controllers/ordenesController');

const router = express.Router();

// Ruta para crear una nueva orden
router.post('/', crearOrden);

// Ruta para obtener todas las órdenes
router.get('/', obtenerOrdenes);

router.get('/usuario', obtenerOrdenesDelUsuario);


// Ruta para obtener una orden específica por ID
router.get('/:id', obtenerOrdenPorId);

module.exports = router;
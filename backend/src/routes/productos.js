const express = require('express');
const {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId 
} = require('../controllers/productosController');

const router = express.Router();

// Rutas de productos
router.post('/', crearProducto);
router.get('/', obtenerProductos);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.get('/:id', obtenerProductoPorId);

module.exports = router;
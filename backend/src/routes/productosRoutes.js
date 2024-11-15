// src/routes/productosRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerProductos, agregarProducto, eliminarProducto } = require('../controllers/productosController');
const { obtenerProductoPorId } = require('../controllers/productosController');
const pool = require('../config/db')

// Ruta para obtener un producto por ID
router.get('/:id', obtenerProductoPorId);

// Ruta para obtener todos los productos
router.get('/', obtenerProductos);

// Ruta para agregar un nuevo producto
router.post('/add', agregarProducto);

// Ruta para eliminar un producto
router.delete('/delete/:id', eliminarProducto);


module.exports = router;
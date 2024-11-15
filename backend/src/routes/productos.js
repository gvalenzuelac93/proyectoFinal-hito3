const express = require('express');
const {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    agregarImagen,
    buscarProductos,
    eliminarImagen
} = require('../controllers/productosController');

const router = express.Router();

// Ruta para buscar productos (debe estar antes de la ruta que maneja ID)
router.get('/search', buscarProductos); // Ruta para buscar productos

// Rutas de productos
router.post('/', crearProducto); // Crear un nuevo producto
router.get('/', obtenerProductos); // Obtener todos los productos
router.get('/:id', obtenerProductoPorId); // Obtener un producto por ID
router.put('/:id', actualizarProducto); // Actualizar un producto
router.delete('/:id', eliminarProducto); // Eliminar un producto

// Rutas para manejar imágenes de productos
router.post('/imagenes', agregarImagen); // Agregar imagen a un producto
router.delete('/imagenes/:id', eliminarImagen); // Eliminar imagen de un producto

module.exports = router;
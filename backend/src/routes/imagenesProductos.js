const express = require('express');
const {
    agregarImagen,
    obtenerImagenes,
    eliminarImagen
} = require('../controllers/imagenesProductosController');

const router = express.Router();

// Rutas de imágenes de productos
router.post('/', agregarImagen);
router.get('/:producto_id', obtenerImagenes);
router.delete('/:id', eliminarImagen);

module.exports = router;
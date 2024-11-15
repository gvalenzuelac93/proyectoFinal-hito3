const express = require('express');
const {
    crearCarrito,
    obtenerCarrito,
    agregarItemAlCarrito,
    obtenerItemsDelCarrito,
    calcularTotalDelCarrito,
    eliminarItemDelCarrito
} = require('../controllers/carritoController');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    const { usuario_id } = req.body;
    const carrito = await crearCarrito(usuario_id);
    res.status(201).json(carrito);
});

// Obtener el carrito de un usuario
router.get('/:usuario_id', async (req, res) => {
    const carrito = await obtenerCarrito(req.params.usuario_id);
    res.json(carrito);
});

// Agregar un item al carrito
router.post('/:carrito_id/items', async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const item = await agregarItemAlCarrito(req.params.carrito_id, producto_id, cantidad);
    res.status(201).json(item);
});

// Obtener items del carrito
router.get('/:carrito_id/items', async (req, res) => {
    const items = await obtenerItemsDelCarrito(req.params.carrito_id);
    res.json(items);
});

// Calcular total del carrito
router .get('/:carrito_id/total', async (req, res) => {
    const total = await calcularTotalDelCarrito(req.params.carrito_id);
    res.json({ total });
});

// Eliminar un item del carrito
router.delete('/items/:id', async (req, res) => {
    await eliminarItemDelCarrito(req.params.id);
    res.status(204).send(); // No content
});

module.exports = router;
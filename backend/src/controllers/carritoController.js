const pool = require('../config/db');

// Crear un nuevo carrito
const crearCarrito = async (usuario_id) => {
    const result = await pool.query(
        'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING *',
        [usuario_id]
    );
    return result.rows[0];
};

// Obtener el carrito de un usuario
const obtenerCarrito = async (usuario_id) => {
    const result = await pool.query(
        'SELECT * FROM carrito WHERE usuario_id = $1',
        [usuario_id]
    );
    return result.rows[0]; // Devuelve el carrito
};

// Agregar un item al carrito
const agregarItemAlCarrito = async (carrito_id, producto_id, cantidad) => {
    const result = await pool.query(
        'INSERT INTO itemcarrito (carrito_id, producto_id, cantidad) VALUES ($1, $2, $3) RETURNING *',
        [carrito_id, producto_id, cantidad]
    );
    return result.rows[0];
};

// Obtener items del carrito
const obtenerItemsDelCarrito = async (carrito_id) => {
    const result = await pool.query(
        'SELECT ic.*, p.titulo, p.precio FROM itemcarrito ic JOIN productos p ON ic.producto_id = p.id WHERE ic.carrito_id = $1',
        [carrito_id]
    );
    return result.rows; // Devuelve los items con los detalles del producto
};

// Calcular el total del carrito
const calcularTotalDelCarrito = async (carrito_id) => {
    const result = await pool.query(
        'SELECT SUM(ic.cantidad * p.precio) AS total FROM itemcarrito ic JOIN productos p ON ic.producto_id = p.id WHERE ic.carrito_id = $1',
        [carrito_id]
    );
    return result.rows[0].total || 0; // Devuelve el total
};

// Eliminar un item del carrito
const eliminarItemDelCarrito = async (id) => {
    await pool.query('DELETE FROM itemcarrito WHERE id = $1', [id]);
};

module.exports = {
    crearCarrito,
    obtenerCarrito,
    agregarItemAlCarrito,
    obtenerItemsDelCarrito,
    calcularTotalDelCarrito,
    eliminarItemDelCarrito
};
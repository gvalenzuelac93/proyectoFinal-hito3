const pool = require('../config/db');

// Crear una nueva orden
const crearOrden = async (req, res) => {
    const { items, total } = req.body;
    const userId = req.user.id; // Obtener el ID del usuario desde el token

    // Validar que haya items
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Se requieren items para crear la orden' });
    }

    try {
        // Insertar la orden en la tabla 'ordenes'
        const result = await pool.query(
            'INSERT INTO ordenes (usuario_id, total, fecha_creacion, estado) VALUES ($1, $2, NOW(), $3) RETURNING *',
            [userId, total, 'pendiente'] // Asigna un estado inicial, por ejemplo 'pendiente'
        );

        const ordenId = result.rows[0].id; // Obtener el ID de la nueva orden

        // Insertar cada item en la tabla 'itemsorden'
        for (const item of items) {
            await pool.query(
                'INSERT INTO itemsorden (orden_id, producto_id, cantidad, precio) VALUES ($1, $2, $3, $4)',
                [ordenId, item.id, item.cantidad, item.precio]
            );
        }

        // Vaciar el carrito del usuario
        await eliminarItemsDelCarrito(userId); // Llama a la función para vaciar el carrito

        // Responder con la orden creada
        res.status(201).json({ id: ordenId, total });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ error: 'Error al procesar la orden' });
    }
};

// Función para eliminar todos los items del carrito del usuario
const eliminarItemsDelCarrito = async (usuarioId) => {
    try {
        await pool.query('DELETE FROM itemcarrito WHERE carrito_id = (SELECT id FROM carritos WHERE usuario_id = $1)', [usuarioId]);
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
    }
};

// Obtener todas las órdenes (opcional)
const obtenerOrdenes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ordenes');
        const ordenes = result.rows;

        // Obtener los productos de cada orden
        for (const orden of ordenes) {
            const productosResult = await pool.query(
                `SELECT io.*, p.titulo FROM itemsorden io
                 JOIN productos p ON io.producto_id = p.id
                 WHERE io.orden_id = $1`,
                [orden.id]
            );
            orden.productos = productosResult.rows; // Agregar los productos a la orden
        }

        res.json(ordenes);
    } catch (error) {
        console.error('Error obteniendo órdenes:', error);
        res.status(500).json({ error: 'Error obteniendo órdenes' });
    }
};

// Obtener una orden específica por ID (opcional)
const obtenerOrdenPorId = async (req, res) => {
    const { id } = req.params;

    // Verificar que el ID es un número entero
    const ordenId = parseInt(id, 10);
    if (isNaN(ordenId)) {
        return res.status(400).json({ error: 'ID de orden inválido' });
    }

    try {
        const result = await pool.query('SELECT * FROM ordenes WHERE id = $1', [ordenId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const orden = result.rows[0];

        // Obtener los productos de la orden
        const productosResult = await pool.query(
            'SELECT * FROM itemsorden WHERE orden_id = $1',
            [orden.id]
        );
        orden.productos = productosResult.rows; // Agregar los productos a la orden

        res.json(orden);
    } catch (error) {
        console.error('Error obteniendo la orden:', error);
        res.status(500).json({ error: 'Error obteniendo la orden' });
    }
};
// Obtener las órdenes del usuario autenticado
const obtenerOrdenesDelUsuario = async (req, res) => {
    const userId = req.user.id; // Obtener el ID del usuario desde el token

    // Verificar que el ID del usuario esté disponible
    if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' });
    }

    try {
        // Obtener las órdenes del usuario autenticado
        const result = await pool.query('SELECT * FROM ordenes WHERE usuario_id = $1', [userId]);
        const ordenes = result.rows;

        // Obtener los productos de cada orden
        for (const orden of ordenes) {
            const productosResult = await pool.query(
                `SELECT io.*, p.titulo FROM itemsorden io
                 JOIN productos p ON io.producto_id = p.id
                 WHERE io.orden_id = $1`,
                [orden.id]
            );
            orden.productos = productosResult.rows; // Agregar los productos a la orden
        }

        res.json(ordenes);
    } catch (error) {
        console.error('Error obteniendo órdenes del usuario:', error);
        res.status(500).json({ error: 'Error obteniendo órdenes' });
    }
};

// Exportar las funciones
module.exports = {
    crearOrden,
    obtenerOrdenes,
    obtenerOrdenesDelUsuario,
    obtenerOrdenPorId,
};
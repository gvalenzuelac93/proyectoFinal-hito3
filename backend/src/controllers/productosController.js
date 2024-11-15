const pool = require('../config/db');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    const { titulo, descripcion, precio, categoria } = req.body;

    try {
        const newProduct = await pool.query(
            'INSERT INTO productos (titulo, descripcion, precio, categoria) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, descripcion, precio, categoria]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ error: 'Error creando producto' });
    }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, precio, categoria } = req.body;

    try {
        const result = await pool.query(
            'UPDATE productos SET titulo = $1, descripcion = $2, precio = $3, categoria = $4 WHERE id = $5 RETURNING *',
            [titulo, descripcion, precio, categoria, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ error: 'Error actualizando producto' });
    }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ error: 'Error eliminando producto' });
    }
};
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'Error obteniendo producto' });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId 
};
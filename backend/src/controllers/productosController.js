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

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    console.log('ID recibido:', id); // Para depurar

    // Validar que el ID sea un número entero
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    try {
        const productResult = await pool.query('SELECT * FROM productos WHERE id = $1', [idNumber]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const imagesResult = await pool.query('SELECT * FROM imagenesproductos WHERE producto_id = $1', [idNumber]);
        const product = productResult.rows[0];
        product.imagenes = imagesResult.rows; // Agregar las imágenes al objeto del producto

        res.json(product);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'Error obteniendo producto' });
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
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
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
        const result = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ error: 'Error eliminando producto' });
    }
};

// Agregar imagen a un producto
const agregarImagen = async (req, res) => {
    const { producto_id, url } = req.body;

    try {
        const newImage = await pool.query(
            'INSERT INTO imagenesproductos (producto_id, url) VALUES ($1, $2) RETURNING *',
            [producto_id, url]
        );
        res.status(201).json(newImage.rows[0]);
    } catch (error) {
        console.error('Error agregando imagen:', error);
        res.status(500).json({ error: 'Error agregando imagen' });
    }
};

// Eliminar imagen de un producto
const eliminarImagen = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM imagenesproductos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json ({ error: 'Imagen no encontrada' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({ error: 'Error eliminando imagen' });
    }
};

// Buscar productos
const buscarProductos = async (req, res) => {
    const { q } = req.query; // Obtener el término de búsqueda desde los parámetros de consulta
    console.log('Consulta de búsqueda:', q); // Verifica el valor de 'q'

    if (!q) {
        return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM productos WHERE titulo ILIKE $1 OR descripcion ILIKE $1',
            [`%${q}%`]
        );
        console.log('Resultados de búsqueda:', result.rows); // Verifica los resultados
        res.json(result.rows);
    } catch (error) {
        console.error('Error buscando productos:', error);
        res.status(500).json({ error: 'Error buscando productos' });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
    agregarImagen,
    eliminarImagen,
    buscarProductos
};
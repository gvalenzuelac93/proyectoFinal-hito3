const pool = require('../config/db');

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

// Obtener imágenes de un producto
const obtenerImagenes = async (req, res) => {
    const { producto_id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM imagenesproductos WHERE producto_id = $1',
            [producto_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo imágenes:', error);
        res.status(500).json({ error: 'Error obteniendo imágenes' });
    }
};

// Eliminar imagen
const eliminarImagen = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM imagenesproductos WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        res.status(500).json({ error: 'Error eliminando imagen' });
    }
};

module.exports = {
    agregarImagen,
    obtenerImagenes,
    eliminarImagen
};
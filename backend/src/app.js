const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productosRoutes = require('./routes/productos'); 
const usuariosRoutes = require('./routes/usuarios');
const carritoRoutes = require('./routes/carrito');
const imagenesProductosRoutes = require('./routes/imagenesProductos');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes); // Asegúrate de que esta línea esté correcta
app.use('/api/carrito', carritoRoutes);
app.use('/api/imagenesproductos', imagenesProductosRoutes);

module.exports = app;
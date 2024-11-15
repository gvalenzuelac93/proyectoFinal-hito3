const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productosRoutes = require('./routes/productos'); 
const usuariosRoutes = require('./routes/usuarios');
const carritoRoutes = require('./routes/carrito');
const imagenesProductosRoutes = require('./routes/imagenesProductos');
const ordenesRoutes = require('./routes/ordenes');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solo este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // Si necesitas enviar cookies o autenticación
}));
app.use(express.json({ limit: '10mb' })); // Ajusta el límite según tus necesidades
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Para formularios

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes); // Asegúrate de que esta línea esté correcta
app.use('/api/carrito', carritoRoutes);
app.use('/api/imagenesproductos', imagenesProductosRoutes);
app.use('/api/ordenes', ordenesRoutes);

module.exports = app;
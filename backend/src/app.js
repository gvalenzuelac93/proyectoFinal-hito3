const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productosRoutes = require('./routes/productos'); 
const usuariosRoutes = require('./routes/usuarios');
const carritoRoutes = require('./routes/carrito');
const imagenesProductosRoutes = require('./routes/imagenesProductos');
const ordenesRoutes = require('./routes/ordenes');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://tiendakpop.netlify.app', // Permitir solo este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true, // 
}));
app.use(express.json({ limit: '10mb' })); 
app.use(cookieParser());
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Para formularios

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes); // Asegúrate de que esta línea esté correcta
app.use('/api/carrito', carritoRoutes);
app.use('/api/imagenesproductos', imagenesProductosRoutes);
app.use('/api/ordenes', ordenesRoutes);

module.exports = app;
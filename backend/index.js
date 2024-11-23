require('dotenv').config();
const app = require('./src/app');

// Verificar que JWT_SECRET esté cargado correctamente
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET no está definido en las variables de entorno');
  process.exit(1); // Detener el servidor si no está configurada la clave secreta
}

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
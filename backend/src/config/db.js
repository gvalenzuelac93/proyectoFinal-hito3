const { Pool } = require('pg');

// Usa la URL pública de la base de datos de Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL, 
  ssl: {
    rejectUnauthorized: false,  // Esto desactiva la verificación del certificado SSL si es necesario
  },
});

module.exports = pool;

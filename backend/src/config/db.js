const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // Reemplaza con tu usuario de PostgreSQL
  host: 'localhost',
  database: 'finaltest', // Reemplaza con el nombre de tu base de datos
  password: 'LmGl1993', // Reemplaza con tu contraseña de PostgreSQL
  port: 5432,
});

module.exports = pool;